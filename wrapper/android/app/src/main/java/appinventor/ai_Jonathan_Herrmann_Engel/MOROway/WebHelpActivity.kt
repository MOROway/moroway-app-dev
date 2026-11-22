package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.net.Uri
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class WebHelpActivity : WebActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Android draws the app edge-to-edge: keep the content clear of the system bars and cutouts
        ViewCompat.setOnApplyWindowInsetsListener(
            findViewById(android.R.id.content)
        ) { view, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }
        setWeb(
            "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/help/index.html"
        )
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                goBack()
            }
        })
    }

    override fun onNewUri(uri: Uri) {}

    override fun goBack() {
        runOnUiThread {
            if (!binding.webAnimation.canGoBack()) {
                finish()
            } else {
                binding.webAnimation.goBack()
            }
        }
    }
}
