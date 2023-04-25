package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

internal class WebJSInterface(private val c: Context) {
    @JavascriptInterface
    fun setSetting(setting: String?, value: Boolean) {
        val e = c.getSharedPreferences("MOROwayAnimSettings", Context.MODE_PRIVATE).edit()
        e.putBoolean(setting, value)
        e.apply()
    }

    @JavascriptInterface
    fun setLang(lang: String?) {
        val e = c.getSharedPreferences("MOROwaySettings", Context.MODE_PRIVATE).edit()
        if (lang != null) {
            e.putString("lang", lang.replace(Regex("_.*$"), ""))
            e.putString("langRegion", lang.replace(Regex("^[^_]*_?"),""))
        }
        e.apply()
        try {
            (c as WebSettingsActivity).reload()
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
        val e = c.getSharedPreferences("MOROwayAnimServerNote", Context.MODE_PRIVATE).edit()
        e.putInt("id", id)
        e.putString("title", title)
        e.putString("text", text)
        e.putLong("validUntil", validUntil)
        e.putString("link", link)
        e.putString("image", image)
        e.putString("imageLink", imageLink)
        e.putString("backgroundImage", backgroundImage)
        e.apply()
    }
}
