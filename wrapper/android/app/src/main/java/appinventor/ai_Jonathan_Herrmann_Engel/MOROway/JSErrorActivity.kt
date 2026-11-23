package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.ActivityNotFoundException
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.core.net.toUri
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityJserrorBinding
import java.util.Locale

class JSErrorActivity : MOROwayActivity() {
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityJserrorBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
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
        val bundle = intent.extras
        binding.jsErrorEmoji.text = String(Character.toChars(0x1F622))
        binding.jsErrorButtonWebView.setOnClickListener {
            val webViewName = "com.google.android.webview"
            try {
                startActivity(
                    Intent(
                        Intent.ACTION_VIEW,
                        "market://details?id=$webViewName".toUri()
                    )
                )
            } catch (_: ActivityNotFoundException) {
                startActivity(
                    Intent(
                        Intent.ACTION_VIEW,
                        "https://play.google.com/store/apps/details?id=$webViewName".toUri()
                    )
                )
            }
        }
        if (bundle == null) {
            binding.jsErrorTextLogIntro.visibility = View.GONE
            binding.jsErrorTextLog.visibility = View.GONE
            binding.jsErrorButtonFeedback.visibility = View.GONE
        } else {
            val errorString = bundle.getString("error")
            if (errorString != null && errorString != "") {
                binding.jsErrorTextLog.text = errorString
            }
            binding.jsErrorButtonFeedback.setOnClickListener {
                startActivity(
                    Intent(
                        Intent.ACTION_VIEW,
                        String.format(Globals.FEEDBACK_URL, Locale.getDefault().language).toUri()
                    )
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        exitApp()
    }
}
