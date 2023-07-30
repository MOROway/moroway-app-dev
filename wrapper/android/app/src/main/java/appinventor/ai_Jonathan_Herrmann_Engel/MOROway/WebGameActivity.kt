package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.annotation.RequiresApi
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityAnimationActivityBinding
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogBackConfirmBinding

class WebGameActivity : MOROwayActivity() {
    private lateinit var binding: ActivityAnimationActivityBinding
    private var isOnlineGame = false
    private var isDemoGame = false
    private var location = ""
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAnimationActivityBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain(Globals.WEBVIEW_DOMAIN)
            .addPathHandler(Globals.WEBVIEW_PATH, AssetsPathHandler(this))
            .build()
        binding.animationWeb.resumeTimers()
        binding.animationWeb.webViewClient = object : WebViewClient() {
            private fun overrideUrl(uri: Uri): Boolean {
                if (!uri.toString()
                        .matches(("https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "(.*)").toRegex())
                ) {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                    return true
                }
                val queryString = getUriQuery(uri)
                evaluateLocation(queryString)
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
                super.onPageStarted(binding.animationWeb, url, favicon)
                initWeb(binding.animationWeb, true)
                binding.pageLoading.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(binding.animationWeb, url)
                if (url == "about:blank") {
                    binding.animationWeb.clearCache(true)
                    binding.animationWeb.clearHistory()
                    binding.animationWeb.loadUrl(location)
                }
                initWeb(binding.animationWeb, true)
                binding.pageLoading.visibility = View.INVISIBLE
            }
        }
        binding.animationWeb.addJavascriptInterface(WebJSInterface(this), "WebJSInterface")
        loadInitialURL(intent)
        binding.backToLastActivity.setOnClickListener {
            goBack()
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                goBack()
            }
        })
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        loadInitialURL(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.animationWeb.pauseTimers()
        binding.animationWeb.destroy()
    }

    private fun loadInitialURL(intent: Intent) {
        var queryString: String? = ""
        val uri = intent.data
        val bundle = intent.extras
        if (uri != null) {
            queryString = getUriQuery(uri)
        } else if (bundle != null) {
            queryString = bundle.getString("queryString")
        }
        evaluateLocation(queryString)
        initWeb(binding.animationWeb, true)
        binding.animationWeb.loadUrl("about:blank")
    }

    private fun getUriQuery(uri: Uri): String? {
        var queryString: String? = ""
        try {
            val pathSegments = uri.pathSegments
            queryString =
                if (uri.host!!.lowercase() == Globals.MULTIPLAYER_URL && pathSegments[0].matches("\\d+".toRegex()) && pathSegments[1].matches(
                        "[a-zA-Z\\d]+".toRegex()
                    )
                ) {
                    val id = pathSegments[0].toInt()
                    val key = pathSegments[1]
                    "mode=multiplay&id=$id&key=$key"
                } else {
                    uri.query
                }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return queryString
    }

    private fun evaluateLocation(queryString: String?) {
        isOnlineGame = false
        isDemoGame = false
        location =
            "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/index.html"
        if (queryString != null && queryString.isNotEmpty()) {
            location += "?$queryString"
            val locationUri = Uri.parse(location)
            if (locationUri.getQueryParameter("mode") == "multiplay") {
                isOnlineGame = true
            } else if (locationUri.getQueryParameter("mode") == "demoStandalone") {
                isDemoGame = true
            }
        }
    }

    private fun goBack() {
        val animSettings = getSharedPreferences("MOROwayAnimSettings", MODE_PRIVATE)
        if (isOnlineGame || !animSettings.getBoolean("saveGame", true) && !isDemoGame) {
            val backConfirm = Dialog(this, R.style.versionNoteDialog)
            val backConfirmBinding = DialogBackConfirmBinding.inflate(
                layoutInflater
            )
            backConfirm.setContentView(backConfirmBinding.root)
            backConfirm.setTitle(getString(R.string.d_confirmback_title))
            backConfirm.window!!
                .setLayout(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT
                )
            if (isOnlineGame) {
                backConfirmBinding.backDialogText.setText(R.string.d_confirmback_text_online)
            } else {
                backConfirmBinding.backDialogText.setText(R.string.d_confirmback_text_offline)
            }
            backConfirmBinding.backConfirm.setOnClickListener {
                backConfirm.dismiss()
                finish()
            }
            backConfirmBinding.backCancel.setOnClickListener { backConfirm.dismiss() }
            backConfirm.show()
        } else {
            finish()
        }
    }

}
