package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import androidx.activity.OnBackPressedCallback
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogBackConfirmBinding

class WebGameActivity : WebActivity() {
    private var onlineGame = false
    private var demoGame = false
    private val gameLocation =
        "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/index.html"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setWeb(processAndGetURL(intent), true)
        binding.webBack.visibility = View.VISIBLE
        binding.webBack.setOnClickListener {
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
        loadNewUri(processAndGetURL(intent), true)
    }

    override fun onNewUri(uri: Uri) {
        val queryString = uri.query
        processAndGetURL(uri.toString(), queryString)
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

    private fun processAndGetURL(intent: Intent): String {
        var queryString: String? = ""
        val uri = intent.data
        val bundle = intent.extras
        if (uri != null) {
            queryString = getUriQuery(uri)
        } else if (bundle != null) {
            queryString = bundle.getString("queryString")
        }
        return processAndGetURL(gameLocation, queryString)

    }

    private fun processAndGetURL(location: String, queryString: String?): String {
        var locationOutput = location
        if (locationOutput.startsWith(gameLocation)) {
            locationOutput = gameLocation
            onlineGame = false
            demoGame = false
            if (!queryString.isNullOrEmpty()) {
                locationOutput += "?$queryString"
                val locationUri = Uri.parse(locationOutput)
                if (locationUri.getQueryParameter("mode") == "multiplay") {
                    onlineGame = true
                } else if (locationUri.getQueryParameter("mode") == "demoStandalone") {
                    demoGame = true
                }
            }
        }
        return locationOutput
    }

    private fun goBack() {
        val animSettings = getSharedPreferences("MOROwayAnimSettings", MODE_PRIVATE)
        if (onlineGame || (!animSettings.getBoolean("saveGame", true) && !demoGame)) {
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
            if (onlineGame) {
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
