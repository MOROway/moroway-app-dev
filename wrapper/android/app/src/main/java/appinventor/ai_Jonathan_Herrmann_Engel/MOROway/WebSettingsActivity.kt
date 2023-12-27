package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.core.content.ContextCompat

class WebSettingsActivity : WebActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding.root.background = ColorDrawable(ContextCompat.getColor(this, R.color.white_light))
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
