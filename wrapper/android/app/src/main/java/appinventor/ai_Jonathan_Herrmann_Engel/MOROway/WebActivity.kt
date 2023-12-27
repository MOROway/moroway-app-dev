package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityWebBinding

abstract class WebActivity : MOROwayActivity() {
    protected lateinit var binding: ActivityWebBinding
    private var location = ""
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWebBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.webAnimation.pauseTimers()
        binding.webAnimation.destroy()
    }

    private fun initWeb(webView: WebView) {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
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
                }
                initWeb(binding.webAnimation)
                binding.webAnimation.visibility = View.VISIBLE
            }
        }
        location = url
        binding.webAnimation.loadUrl(url)
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
