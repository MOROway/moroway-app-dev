package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.TypedValue
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.widget.Button
import androidx.activity.OnBackPressedCallback
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityMenuBinding
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogDemoModeBinding
import kotlin.math.pow
import kotlin.math.sqrt


class MenuActivity : MOROwayActivity() {
    private lateinit var binding: ActivityMenuBinding
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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
            val demoModeDialog = Dialog(this, R.style.versionNoteDialog)
            val demoModeDialogBinding = DialogDemoModeBinding.inflate(
                layoutInflater
            )
            demoModeDialog.setContentView(demoModeDialogBinding.root)
            demoModeDialog.setTitle(R.string.generalTitleDemoMode)
            demoModeDialog.window!!
                .setLayout(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT
                )
            demoModeDialogBinding.demoMode3d.setOnCheckedChangeListener { _, isChecked ->
                demoModeDialogBinding.demoMode3dOnly.visibility = if (isChecked) {
                    View.VISIBLE
                } else {
                    View.GONE
                }
            }
            demoModeDialogBinding.demoMode3dOnly.visibility =
                if (demoModeDialogBinding.demoMode3d.isChecked) {
                    View.VISIBLE
                } else {
                    View.GONE
                }
            demoModeDialogBinding.dDemoModeGo.setOnClickListener {
                val intent = Intent(this, WebGameActivity::class.java)
                intent.putExtra(
                    "queryString",
                    "mode=demoStandalone&gui-3d=" + (if (demoModeDialogBinding.demoMode3d.isChecked) {
                        1
                    } else {
                        0
                    }) + "&gui-3d-night=" + (if (demoModeDialogBinding.demoMode3dNight.isChecked) {
                        1
                    } else {
                        0
                    }) + "&gui-demo-3d-rotation-speed-percent=" + demoModeDialogBinding.dDemoMode3dRotationSpeed.progress
                )
                demoModeDialog.dismiss()
                startActivity(intent)
            }
            demoModeDialog.show()
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
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                backToHome()
            }
        })
    }

    public override fun onResume() {
        super.onResume()
        binding.homeButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_small)
        )
        binding.homeButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.homeButton)
        )
        binding.animationButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_huge)
        )
        binding.animationButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationButton)
        )
        binding.animationTeamplayButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_big)
        )
        binding.animationTeamplayButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationTeamplayButton)
        )
        binding.animationDemoButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_big)
        )
        binding.animationDemoButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animationDemoButton)
        )
        binding.helpButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_medium)
        )
        binding.helpButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.helpButton)
        )
        binding.animSettingsButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            resources.getDimension(R.dimen.options_button_small)
        )
        binding.animSettingsButton.setTextSize(
            TypedValue.COMPLEX_UNIT_PX,
            getButtonTextSize(binding.animSettingsButton)
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
