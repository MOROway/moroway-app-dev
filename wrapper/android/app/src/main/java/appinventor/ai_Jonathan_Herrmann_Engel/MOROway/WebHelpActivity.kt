package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.net.Uri
import android.os.Bundle
import androidx.activity.OnBackPressedCallback

class WebHelpActivity : WebActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setWeb(
            "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/help/index.html",
            false
        )
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (!binding.webAnimation.canGoBack()) {
                    finish()
                } else {
                    binding.webAnimation.goBack()
                }
            }
        })
    }

    override fun onNewUri(uri: Uri) {}
}
