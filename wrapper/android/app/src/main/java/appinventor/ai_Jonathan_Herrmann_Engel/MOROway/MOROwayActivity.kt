package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Context
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.os.Bundle
import android.os.Process
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import java.util.Locale
import kotlin.system.exitProcess

open class MOROwayActivity : AppCompatActivity() {
    override fun attachBaseContext(base: Context) {
        val settings = base.getSharedPreferences("MOROwaySettings", MODE_PRIVATE)
        val language = settings.getString("lang", "")
        val region = settings.getString("langRegion", "")
        val configuration = base.resources.configuration
        if (language != null) {
            if (language.isNotEmpty()) {
                val locale = if (region.isNullOrEmpty()) {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.BAKLAVA) {
                        Locale.of(language)
                    } else {
                        Locale(language)
                    }
                } else {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.BAKLAVA) {
                        Locale.of(language, region)
                    } else {
                        Locale(language, region)
                    }
                }
                Locale.setDefault(locale)
                configuration.setLocale(locale)
            }
        }
        super.attachBaseContext(base.createConfigurationContext(configuration))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyOrientation()
        hideSystemBars()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        // Dialogs, the notification shade or another app can bring the system bars back
        if (hasFocus) {
            hideSystemBars()
        }
    }

    override fun onMultiWindowModeChanged(isInMultiWindowMode: Boolean, newConfig: Configuration) {
        super.onMultiWindowModeChanged(isInMultiWindowMode, newConfig)
        applyOrientation()
    }

    // The landscape lock does not apply in split-screen: there the user sets the window's shape,
    // and a fixed orientation would only letterbox the app
    private fun applyOrientation() {
        val settings = getSharedPreferences("MOROwayAnimSettings", MODE_PRIVATE)
        val lockOrientationLandscape = settings.getBoolean("lockOrientationLandscape", false)
        requestedOrientation = if (lockOrientationLandscape && !isInMultiWindowMode) {
            ActivityInfo.SCREEN_ORIENTATION_USER_LANDSCAPE
        } else {
            ActivityInfo.SCREEN_ORIENTATION_USER
        }
    }

    // A proper fullscreen: the system bars show only briefly after a swipe from the edge
    private fun hideSystemBars() {
        WindowCompat.getInsetsController(window, window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }
    }

    fun exitApp(){
        finishAffinity()
        Process.killProcess(Process.myPid())
        exitProcess(0)
    }
}
