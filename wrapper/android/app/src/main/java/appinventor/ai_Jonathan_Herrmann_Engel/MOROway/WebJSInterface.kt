package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface
import androidx.core.content.edit

internal class WebJSInterface(private val c: Context) {
    @JavascriptInterface
    fun setSetting(setting: String?, value: Boolean) {
        c.getSharedPreferences("MOROwayAnimSettings", Context.MODE_PRIVATE).edit {
            putBoolean(setting, value)
        }
    }

    @JavascriptInterface
    fun getSettingShowVersionNoteAgain(): Boolean {
        val settings = c.getSharedPreferences("MOROwayAnimSettings", Context.MODE_PRIVATE)
        return settings.getBoolean("showVersionNoteAgain", false)
    }

    @JavascriptInterface
    fun setLang(lang: String?) {
        c.getSharedPreferences("MOROwaySettings", Context.MODE_PRIVATE).edit {
            if (lang != null) {
                putString("lang", lang.replace(Regex("_.*$"), ""))
                putString("langRegion", lang.replace(Regex("^[^_]*_?"), ""))
            }
        }
        try {
            (c as WebActivity).reload()
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }

    @JavascriptInterface
    fun goBack() {
        try {
            (c as WebActivity).goBack()
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }

    @JavascriptInterface
    fun throwError(error: String?) {
        val intent = Intent(c, JSErrorActivity::class.java)
        intent.putExtra("error", error)
        c.startActivity(intent)
    }

    @JavascriptInterface
    fun saveServerNote(
        id: Int, title: String?, text: String?, validUntil: Long, link: String?, image: String?,
        imageLink: String?, backgroundImage: String?
    ) {
        c.getSharedPreferences("MOROwayAnimServerNote", Context.MODE_PRIVATE).edit {
            putInt("id", id)
            putString("title", title)
            putString("text", text)
            putLong("validUntil", validUntil)
            putString("link", link)
            putString("image", image)
            putString("imageLink", imageLink)
            putString("backgroundImage", backgroundImage)
        }
    }
}
