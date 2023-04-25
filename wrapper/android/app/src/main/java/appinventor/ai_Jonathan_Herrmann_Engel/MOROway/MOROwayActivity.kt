package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Activity
import android.content.Context
import android.content.pm.ActivityInfo
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

open class MOROwayActivity : AppCompatActivity() {
    override fun attachBaseContext(base: Context) {
        val settings = base.getSharedPreferences("MOROwaySettings", MODE_PRIVATE)
        val language = settings.getString("lang", "")
        val region = settings.getString("langRegion", "")
        val configuration = base.resources.configuration
        if (language != null) {
            if (language.isNotEmpty()) {
                val locale = if (region.isNullOrEmpty()) {
                    Locale(language)
                } else {
                    Locale(language, region)
                }
                Locale.setDefault(locale)
                configuration.setLocale(locale)
            }
        }
        super.attachBaseContext(base.createConfigurationContext(configuration))
    }

    private fun lockActivity(activity: Activity, settingsName: String): Int {
        val settings = activity.getSharedPreferences("MOROwaySettings", MODE_PRIVATE)
        val defaultState = 0
        val state = settings.getInt(settingsName, defaultState)
        return when {
            (state == 1) -> {
                activity.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                state
            }

            (state == 2) -> {
                activity.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                state
            }

            else -> {
                activity.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR
                defaultState
            }
        }
    }

    fun initWeb(webView: WebView, gameView: Boolean) {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        if (gameView) {
            webView.settings.useWideViewPort = true
            webView.settings.builtInZoomControls = false
            webView.settings.setSupportZoom(false)
        }
    }

    fun lockOtherActivity(activity: Activity): Int {
        return lockActivity(activity, "otherScreensState")
    }

    fun lockStartActivity(activity: Activity): Int {
        return lockActivity(activity, "startScreenState")
    }
}
