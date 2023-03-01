package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.os.Bundle
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivitySettingsBinding

class SettingsActivity : MOROwayActivity() {
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val otherScreensState = lockOtherActivity(this)
        val binding = ActivitySettingsBinding.inflate(
            layoutInflater
        )
        setContentView(binding.root)
        val settings = getSharedPreferences("MOROwaySettings", MODE_PRIVATE)
        val editor = settings.edit()
        val startScreenState = settings.getInt("startScreenState", 0)
        val versionNote = settings.getString("versionNoteName", Globals.VERSION_NAME)
        val versionNoteShowAnyway = settings.getBoolean("versionNoteShowAnyWay", false)
        binding.startState.setOnCheckedChangeListener { _, id: Int ->
            when {
                (id == R.id.startStateLandscape) ->
                    editor.putInt("startScreenState", 2)
                (id == R.id.startStatePortrait) ->
                    editor.putInt("startScreenState", 1)
                else ->
                    editor.putInt("startScreenState", 0)
            }
            editor.apply()
        }
        binding.startState.clearCheck()
        when {
            (startScreenState == 2) ->
                binding.startStateLandscape.isChecked = true
            (startScreenState == 1) ->
                binding.startStatePortrait.isChecked = true
            else ->
                binding.startStateAuto.isChecked = true
        }
        binding.otherState.setOnCheckedChangeListener { _, id: Int ->
            when {
                (id == R.id.otherStateLandscape) ->
                    editor.putInt("otherScreensState", 2)
                (id == R.id.otherStatePortrait) ->
                    editor.putInt("otherScreensState", 1)
                else ->
                    editor.putInt("otherScreensState", 0)
            }
            editor.apply()
            lockOtherActivity(this)
        }
        binding.otherState.clearCheck()
        when {
            (otherScreensState == 2) ->
                binding.otherStateLandscape.isChecked = true
            (otherScreensState == 1) ->
                binding.otherStatePortrait.isChecked = true
            else ->
                binding.otherStateAuto.isChecked = true
        }
        binding.setVersionNote.isChecked =
            versionNote != Globals.VERSION_NAME && Globals.SHOW_UPDATE_NOTE || versionNoteShowAnyway
        binding.setVersionNote.setOnCheckedChangeListener { _, isChecked: Boolean ->
            if (isChecked) {
                editor.putBoolean("versionNoteShowAnyWay", true)
            } else {
                editor.remove("versionNoteShowAnyWay")
            }
            editor.apply()
        }
    }
}
