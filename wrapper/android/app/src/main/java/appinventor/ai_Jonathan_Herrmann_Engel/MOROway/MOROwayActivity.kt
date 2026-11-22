package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Context
import android.content.pm.ActivityInfo
import android.os.Bundle
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
        val settings = getSharedPreferences("MOROwayAnimSettings", MODE_PRIVATE)
        val lockOrientationLandscape = settings.getBoolean("lockOrientationLandscape", false)
        requestedOrientation = if (lockOrientationLandscape) {
            ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        } else {
            ActivityInfo.SCREEN_ORIENTATION_SENSOR
        }
    }
}
