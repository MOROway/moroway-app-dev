package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.TypedValue
import android.view.View
import android.view.WindowManager
import android.widget.Button
import androidx.activity.OnBackPressedCallback
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityMenuBinding
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogDemoModeBinding


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
            demoModeDialogBinding.demoModeRandom.setOnCheckedChangeListener { _, isChecked ->
                demoModeDialogBinding.demoModeManualOnly.visibility = if (isChecked) {
                    View.GONE
                } else {
                    View.VISIBLE
                }
            }
            demoModeDialogBinding.demoMode3d.setOnCheckedChangeListener { _, isChecked ->
                demoModeDialogBinding.demoMode3dOnly.visibility = if (isChecked) {
                    View.VISIBLE
                } else {
                    View.GONE
                }
            }
            demoModeDialogBinding.demoMode3dCameraModeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
                when (checkedId) {
                    R.id.demo_mode_3d_camera_mode_radio_birdseye -> {
                        demoModeDialogBinding.demoMode3dCameraBirdseyeOnly.visibility =
                            View.VISIBLE
                    }

                    else -> {
                        demoModeDialogBinding.demoMode3dCameraBirdseyeOnly.visibility = View.GONE
                    }
                }
            }
            demoModeDialogBinding.demoModeManualOnly.visibility =
                if (demoModeDialogBinding.demoModeRandom.isChecked) {
                    View.GONE
                } else {
                    View.VISIBLE
                }
            demoModeDialogBinding.demoMode3dOnly.visibility =
                if (demoModeDialogBinding.demoMode3d.isChecked) {
                    View.VISIBLE
                } else {
                    View.GONE
                }
            demoModeDialogBinding.demoMode3dCameraBirdseyeOnly.visibility =
                if (demoModeDialogBinding.demoMode3dCameraModeRadioBirdseye.isChecked) {
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
                    }) + "&gui-demo-3d-rotation-speed-percent=" + demoModeDialogBinding.dDemoMode3dRotationSpeed.progress + "&gui-3d-cam-mode=" + when (demoModeDialogBinding.demoMode3dCameraModeRadioGroup.checkedRadioButtonId) {
                        R.id.demo_mode_3d_camera_mode_radio_follow_train -> "follow-train"
                        R.id.demo_mode_3d_camera_mode_radio_follow_car -> "follow-car"
                        else -> "birds-eye"
                    } + "&gui-demo-random=" + (if (demoModeDialogBinding.demoModeRandom.isChecked) {
                        1
                    } else {
                        0
                    })
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
        setButtonTextSize(binding.homeButton)
        setButtonTextSize(binding.animationButton)
        setButtonTextSize(binding.animationTeamplayButton)
        setButtonTextSize(binding.animationDemoButton)
        setButtonTextSize(binding.helpButton)
        setButtonTextSize(binding.animSettingsButton)
    }

    private fun setButtonTextSize(view: Button) {
        val width: Int
        val height: Int
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            val windowMetrics = windowManager.currentWindowMetrics
            width = windowMetrics.bounds.width()
            height = windowMetrics.bounds.height()
        } else {
            val metrics = DisplayMetrics()
            windowManager.defaultDisplay.getMetrics(metrics)
            width = metrics.widthPixels
            height = metrics.heightPixels
        }
        view.setTextSize(
            TypedValue.COMPLEX_UNIT_PX, if (width > height) {
                height * 0.1f
            } else {
                height * 0.05f
            }
        )
        var size = view.textSize
        if (view.text.length * size > width) {
            size = width / (view.text.length).toFloat()
        }
        view.setTextSize(
            TypedValue.COMPLEX_UNIT_PX, size.coerceAtLeast(50f)
        )
    }

    private fun backToHome() {
        val intent = Intent(Intent(this, HomeActivity::class.java))
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
        finish()
    }

}
