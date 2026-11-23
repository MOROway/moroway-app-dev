package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.content.res.Configuration
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.RoundedCorner
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityWebBinding
import kotlin.math.max

abstract class WebActivity : MOROwayActivity() {
    protected lateinit var binding: ActivityWebBinding
    private var unsafeArea = Insets.NONE
    private var boardUnsafeArea = Insets.NONE
    private var location = ""
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWebBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
        // Android draws the app edge-to-edge: the pages draw under the system bars and cutouts and
        // keep their content clear of them
        ViewCompat.setOnApplyWindowInsetsListener(
            findViewById(android.R.id.content)
        ) { _, insets ->
            unsafeArea = Insets.max(
                insets.getInsets(
                    WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
                ),
                getRoundedCornerUnsafeArea(insets)
            )
            boardUnsafeArea = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            injectUnsafeArea()
            WindowInsetsCompat.CONSUMED
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.webAnimation.pauseTimers()
        binding.webAnimation.destroy()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        // The web app tracks the window focus by blur and focus events, which the web view does
        // not fire when another app takes the focus in split-screen
        val type = if (hasFocus) "focus" else "blur"
        binding.webAnimation.evaluateJavascript(
            "window.dispatchEvent(new FocusEvent(\"$type\"))", null
        )
    }

    private fun initWeb(webView: WebView) {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.mediaPlaybackRequiresUserGesture = false
        webView.settings.useWideViewPort = true
        webView.settings.builtInZoomControls = false
        webView.settings.setSupportZoom(false)
    }

    protected fun setWeb(url: String) {
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain(Globals.WEBVIEW_DOMAIN)
            .addPathHandler(Globals.WEBVIEW_PATH, AssetsPathHandler(this))
            .build()
        initWeb(binding.webAnimation)
        binding.webAnimation.resumeTimers()
        binding.webAnimation.addJavascriptInterface(WebJSInterface(this), "WebJSInterface")
        binding.webAnimation.webViewClient = object : WebViewClient() {
            private fun overrideUrl(uri: Uri): Boolean {
                if (!uri.toString()
                        .matches(("https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "(.*)").toRegex())
                ) {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                    return true
                }
                onNewUri(uri)
                return false
            }

            override fun shouldOverrideUrlLoading(
                view: WebView,
                webResourceRequest: WebResourceRequest
            ): Boolean {
                return if (webResourceRequest.isForMainFrame) {
                    overrideUrl(webResourceRequest.url)
                } else false
            }

            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                val interceptedWebRequest = assetLoader.shouldInterceptRequest(request.url)
                interceptedWebRequest?.let { webResourceResponse ->
                    if ((request.url.pathSegments.find { it.startsWith("jsm") } != null) && (request.url.lastPathSegment?.endsWith(
                            ".js",
                            true
                        ) == true)) {
                        webResourceResponse.mimeType = "text/javascript"
                    }
                }
                return interceptedWebRequest
            }

            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                super.onPageStarted(binding.webAnimation, url, favicon)
                binding.webAnimation.visibility = View.INVISIBLE
                initWeb(binding.webAnimation)
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(binding.webAnimation, url)
                if (url == "about:blank") {
                    binding.webAnimation.clearCache(true)
                    binding.webAnimation.clearHistory()
                    binding.webAnimation.loadUrl(location)
                } else {
                    injectUnsafeArea()
                }
                initWeb(binding.webAnimation)
                binding.webAnimation.visibility = View.VISIBLE
            }
        }
        location = url
        binding.webAnimation.loadUrl(url)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        injectUnsafeArea()
    }

    // Rounded screen corners hide the outer corner of a control along an edge and make it hard to
    // reach: keep it clear sideways by half the larger radius of the side's two corners (at the top
    // and bottom that would only lift it off the edge)
    private fun getRoundedCornerUnsafeArea(insets: WindowInsetsCompat): Insets {
        val windowInsets = insets.toWindowInsets()
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S || windowInsets == null) {
            return Insets.NONE
        }
        val radii = listOf(
            RoundedCorner.POSITION_TOP_LEFT,
            RoundedCorner.POSITION_TOP_RIGHT,
            RoundedCorner.POSITION_BOTTOM_RIGHT,
            RoundedCorner.POSITION_BOTTOM_LEFT
        ).map { (windowInsets.getRoundedCorner(it)?.radius ?: 0) * 0.5 }
        return Insets.of(
            max(radii[0], radii[3]).toInt(),
            0,
            max(radii[1], radii[2]).toInt(),
            0
        )
    }

    // The web view reports no safe area for the system bars: pass the hidden edges in CSS pixels
    // to the page, which reads them like its safe-area insets; the game board ignores the camera
    // cutout
    private fun injectUnsafeArea() {
        val density = resources.displayMetrics.density
        val properties = mapOf("unsafe-area" to unsafeArea, "board-unsafe-area" to boardUnsafeArea)
        binding.webAnimation.evaluateJavascript(
            properties.entries.joinToString("") { (name, area) ->
                mapOf(
                    "top" to area.top,
                    "right" to area.right,
                    "bottom" to area.bottom,
                    "left" to area.left
                ).entries.joinToString("") { (side, px) ->
                    "document.documentElement.style" +
                            ".setProperty(\"--$name-$side\", \"${px / density}px\");"
                }
            } + "window.dispatchEvent(new Event(\"resize\"));", null
        )
    }

    protected fun loadNewUri(url: String) {
        initWeb(binding.webAnimation)
        location = url
        binding.webAnimation.loadUrl("about:blank")
    }

    fun reload() {
        runOnUiThread { binding.webAnimation.reload() }
    }

    abstract fun onNewUri(uri: Uri)

    abstract fun goBack()

}
