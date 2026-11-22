package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.view.WindowManager
import androidx.activity.OnBackPressedCallback
import androidx.core.content.ContextCompat
import androidx.core.graphics.Insets
import androidx.core.graphics.drawable.toDrawable
import androidx.core.net.toUri
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogBackConfirmBinding

class WebGameActivity : WebActivity() {
    private var onlineGame = false
    private var demoGame = false
    private var unsafeArea = Insets.NONE
    private val gameLocation =
        "https://" + Globals.WEBVIEW_DOMAIN + Globals.WEBVIEW_PATH + "animation/index.html"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Android draws the app edge-to-edge: the game draws under the system bars and cutouts and
        // keeps its controls clear of them
        ViewCompat.setOnApplyWindowInsetsListener(
            findViewById(android.R.id.content)
        ) { _, insets ->
            unsafeArea = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            injectUnsafeArea()
            WindowInsetsCompat.CONSUMED
        }
        binding.root.background = ContextCompat.getColor(this, R.color.black).toDrawable()
        setWeb(processAndGetURL(intent))
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                goBack()
            }
        })
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        loadNewUri(processAndGetURL(intent))
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        injectUnsafeArea()
    }

    override fun onPageReady() {
        injectUnsafeArea()
    }

    // The web view reports no safe area for the system bars: pass the hidden edges in CSS pixels
    // to the game, which reads them like its safe-area insets
    private fun injectUnsafeArea() {
        val density = resources.displayMetrics.density
        val sides = mapOf(
            "top" to unsafeArea.top,
            "right" to unsafeArea.right,
            "bottom" to unsafeArea.bottom,
            "left" to unsafeArea.left
        )
        binding.webAnimation.evaluateJavascript(sides.entries.joinToString("") { (side, px) ->
            "document.documentElement.style" +
                ".setProperty(\"--unsafe-area-$side\", \"${px / density}px\");"
        } + "window.dispatchEvent(new Event(\"resize\"));", null)
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
                    "mode=multiplayer&id=$id&key=$key"
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
                val locationUri = locationOutput.toUri()
                if (locationUri.getQueryParameter("mode") == "multiplayer") {
                    onlineGame = true
                } else if (locationUri.getQueryParameter("mode") == "demo") {
                    demoGame = true
                }
            }
        }
        return locationOutput
    }

    override fun goBack() {
        runOnUiThread {
            val animSettings = getSharedPreferences("MOROwayAnimSettings", MODE_PRIVATE)
            if (onlineGame || (!animSettings.getBoolean("saveGame", true) && !demoGame)) {
                val backConfirm = Dialog(this@WebGameActivity, R.style.versionNoteDialog)
                val backConfirmBinding = DialogBackConfirmBinding.inflate(
                    layoutInflater
                )
                backConfirm.setContentView(backConfirmBinding.root)
                backConfirm.setTitle(getString(R.string.generalLeaveAndDestroyGameTitle))
                backConfirm.window!!
                    .setLayout(
                        WindowManager.LayoutParams.MATCH_PARENT,
                        WindowManager.LayoutParams.MATCH_PARENT
                    )
                if (onlineGame) {
                    backConfirmBinding.backDialogText.setText(R.string.generalLeaveAndDestroyGameOnline)
                } else {
                    backConfirmBinding.backDialogText.setText(R.string.generalLeaveAndDestroyGame)
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

}
