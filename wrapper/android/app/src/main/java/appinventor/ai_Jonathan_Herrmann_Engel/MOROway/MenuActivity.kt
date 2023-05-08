package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Intent
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.TypedValue
import android.view.WindowInsets
import android.widget.Button
import androidx.activity.OnBackPressedCallback
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityMenuBinding
import kotlin.math.pow
import kotlin.math.sqrt


class MenuActivity : MOROwayActivity() {
    private lateinit var binding: ActivityMenuBinding
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lockOtherActivity(this)
        binding = ActivityMenuBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
        binding.homeButton.setOnClickListener { backToHome() }
        binding.homeButton.setOnLongClickListener {
            startActivity(Intent(this, Gimmick2Activity::class.java))
            true
        }
        binding.animationButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    WebGameActivity::class.java
                )
            )
        }
        binding.animationButton.setOnLongClickListener {
            startActivity(Intent(this, Gimmick1Activity::class.java))
            true
        }
        binding.animationTeamplayButton.setOnClickListener {
            val intent = Intent(this, WebGameActivity::class.java)
            intent.putExtra("queryString", "mode=multiplay")
            startActivity(intent)
        }
        binding.animationDemoButton.setOnClickListener {
            val intent = Intent(this, WebGameActivity::class.java)
            intent.putExtra("queryString", "mode=demoStandalone")
            startActivity(intent)
        }
        binding.helpButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    WebHelpActivity::class.java
                )
            )
        }
        binding.animSettingsButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    WebSettingsActivity::class.java
                )
            )
        }
        binding.settingsButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    SettingsActivity::class.java
                )
            )
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                backToHome()
            }
        })
    }

    public override fun onResume() {
        super.onResume()
        lockOtherActivity(this)
        binding.homeButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.homeButton)
        )
        binding.animationButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationButton)
        )
        binding.animationTeamplayButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationTeamplayButton)
        )
        binding.animationDemoButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationDemoButton)
        )
        binding.helpButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.helpButton)
        )
        binding.animSettingsButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animSettingsButton)
        )
        binding.settingsButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.settingsButton)
        )
    }

    private fun getButtonTextSize(view: Button): Float {
        val width: Int
        val height: Int
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            val windowMetrics = windowManager.currentWindowMetrics
            val insets =
                windowMetrics.windowInsets.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars())
            width = windowMetrics.bounds.width() - insets.left - insets.right
            height = windowMetrics.bounds.height() - insets.top - insets.bottom
        } else {
            val metrics = DisplayMetrics()
            windowManager.defaultDisplay.getMetrics(metrics)
            width = metrics.widthPixels
            height = metrics.heightPixels
        }
        val diagonal = sqrt(
            (width / resources.displayMetrics.xdpi).toDouble()
                .pow(2.0) + (height / resources.displayMetrics.ydpi).toDouble().pow(2.0)
        )
        val base = 5.8
        var size = view.textSize
        if (diagonal > base) {
            val factor = (diagonal / base).toFloat()
            size *= factor
        }
        if (view.text.length * size > width) {
            size = width / (view.text.length).toFloat()
        }
        return size.coerceAtLeast(50f)
    }

    private fun backToHome() {
        val intent = Intent(Intent(this, HomeActivity::class.java))
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
        finish()
    }

}
