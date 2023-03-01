package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.content.res.Configuration
import android.os.Bundle
import android.widget.Toast

class Gimmick2Activity : MOROwayActivity() {
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lockOtherActivity(this)
        setContentView(R.layout.activity_gimmick2)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        if (lockOtherActivity(this) == 0) {
            Toast.makeText(this, R.string.a_g2_turned, Toast.LENGTH_LONG).show()
        }
    }
}
