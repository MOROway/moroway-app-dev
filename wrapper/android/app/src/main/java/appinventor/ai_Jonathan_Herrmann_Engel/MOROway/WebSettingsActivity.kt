package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toDrawable
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class WebSettingsActivity : WebActivity() {
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
        binding.root.background = ContextCompat.getColor(this, R.color.white_light).toDrawable()
        setWeb(
            "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/settings/index.html"
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
            val intent = Intent(Intent(this@WebSettingsActivity, MenuActivity::class.java))
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
            finish()
        }
    }
}
