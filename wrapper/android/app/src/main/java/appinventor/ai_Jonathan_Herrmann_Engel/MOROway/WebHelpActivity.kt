package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.annotation.RequiresApi
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityAnimationHelpBinding

class WebHelpActivity : MOROwayActivity() {
    private var binding: ActivityAnimationHelpBinding? = null
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lockOtherActivity(this)
        binding = ActivityAnimationHelpBinding.inflate(
            layoutInflater
        )
        setContentView(binding!!.root)
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain(Globals.WEBVIEW_DOMAIN)
            .addPathHandler(Globals.WEBVIEW_PATH, AssetsPathHandler(this))
            .build()
        initWeb(binding!!.animationWeb, false)
        binding!!.animationWeb.addJavascriptInterface(WebJSInterface(this), "WebJSInterface")
        binding!!.animationWeb.loadUrl("https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/help/index.html")
        binding!!.animationWeb.webViewClient = object : WebViewClient() {
            private fun overrideUrl(uri: Uri): Boolean {
                if (!uri.toString()
                        .matches(("https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "(.*)").toRegex())
                ) {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                    return true
                }
                return false
            }

            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                return overrideUrl(Uri.parse(url))
            }

            @RequiresApi(Build.VERSION_CODES.N)
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
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                super.onPageStarted(binding!!.animationWeb, url, favicon)
                initWeb(binding!!.animationWeb, false)
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(binding!!.animationWeb, url)
                initWeb(binding!!.animationWeb, false)
            }
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (!binding!!.animationWeb.canGoBack()) {
                    binding!!.animationWeb.destroy()
                    finish()
                } else {
                    binding!!.animationWeb.goBack()
                }
            }
        })
    }
}
