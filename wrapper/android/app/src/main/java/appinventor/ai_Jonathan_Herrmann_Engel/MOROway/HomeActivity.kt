package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.app.Dialog
import android.content.Intent
import android.content.SharedPreferences
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.TypedValue
import android.view.*
import android.view.GestureDetector.SimpleOnGestureListener
import android.view.ScaleGestureDetector.SimpleOnScaleGestureListener
import android.widget.ImageView
import android.widget.RelativeLayout
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.ActivityMorowayAppBinding
import appinventor.ai_Jonathan_Herrmann_Engel.MOROway.databinding.DialogPopupBinding
import com.squareup.picasso.Picasso
import kotlin.math.abs


class HomeActivity : MOROwayActivity() {
    private var binding: ActivityMorowayAppBinding? = null
    private var width = 0
    private var dimen = 0
    private var portraitPictureSettingsEditor: SharedPreferences.Editor? = null
    private var portraitPictureCurrent = 0
    private var portraitPictureBig = false
    private var portraitPictureAllowZoom = false
    private var portraitPictureBigAndZoomed = false
    private var portraitPictureLayoutParams: RelativeLayout.LayoutParams? = null
    private var portraitPictureZoom: ScaleGestureDetector? = null
    private var portraitPictureSwipe: GestureDetector? = null
    private var portraitPictureZoomOffsetX = 0f
    private var portraitPictureZoomOffsetY = 0f
    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lockStartActivity(this)
        binding = ActivityMorowayAppBinding.inflate(
            layoutInflater
        )
        setContentView(binding!!.root)
        val settings = getSharedPreferences("MOROwaySettings", MODE_PRIVATE)
        val settingsEditor = settings.edit()

        val height : Int
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            val windowMetrics = windowManager.currentWindowMetrics
            val insets = windowMetrics.windowInsets.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars())
            width = windowMetrics.bounds.width() - insets.left - insets.right
            height = windowMetrics.bounds.height() - insets.top - insets.bottom
        } else {
            val metrics = DisplayMetrics()
            windowManager.defaultDisplay.getMetrics(metrics)
            width = metrics.widthPixels
            height =  metrics.heightPixels
        }
        dimen = height / 30
        binding!!.animationButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    WebGameActivity::class.java
                )
            )
        }
        binding!!.moreButton.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    MenuActivity::class.java
                )
            )
        }
        if (resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) {
            //Image & ImageSettings
            val portraitPictureSettings = getSharedPreferences("CSpicValue", MODE_PRIVATE)
            portraitPictureSettingsEditor = portraitPictureSettings.edit()
            portraitPictureCurrent = portraitPictureSettings.getInt("CSpic", 0)
            portraitPictureBig = portraitPictureSettings.getBoolean("CSpicBigSize", true)
            portraitPictureAllowZoom = portraitPictureBig
            portraitPictureLayoutParams = RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            val imageContext = binding!!.bigStylePictures!!.context
            portraitPictureZoom = ScaleGestureDetector(
                imageContext,
                ScaleListener()
            )
            portraitPictureSwipe = GestureDetector(
                imageContext,
                SwipeListener()
            )
            updateImageSettings()
            resetImage()
            setImage()

            //Buttons
            binding!!.imageHandlerForwards!!.setOnClickListener { nextImage() }
            binding!!.imageHandlerBackwards!!.setOnClickListener { prevImage() }
            val marginHandler = width / 15
            binding!!.imageHandlerForwards!!.setPadding(marginHandler, 0, 0, 0)
            binding!!.imageHandlerBackwards!!.setPadding(0, 0, marginHandler, 0)
            binding!!.imageHandlerForwards!!.setTextSize(TypedValue.COMPLEX_UNIT_PX, height / 17f)
            binding!!.imageHandlerBackwards!!.setTextSize(TypedValue.COMPLEX_UNIT_PX, height / 17f)
            val paddingButton = height / 20
            binding!!.animationButton.setTextSize(TypedValue.COMPLEX_UNIT_PX, height * 0.1f)
            binding!!.moreButton.setTextSize(TypedValue.COMPLEX_UNIT_PX, height * 0.05f)
            binding!!.moreButton.setPadding(0, paddingButton, 0, paddingButton)
        } else {
            binding!!.homescreenbuttons!!.setOnClickListener(null)
            //Buttons
            binding!!.animationButton.setTextSize(TypedValue.COMPLEX_UNIT_PX, width * 0.088f)
            binding!!.moreButton.setTextSize(TypedValue.COMPLEX_UNIT_PX, width * 0.044f)
            binding!!.aboutButton!!.setOnClickListener {
                startActivity(
                    Intent(
                        this,
                        WebHelpActivity::class.java
                    )
                )
            }
            binding!!.aboutButton!!.setTextSize(TypedValue.COMPLEX_UNIT_PX, width * 0.044f)
        }

        //Inform about new Version or Server messages
        val serverMsgSettings = getSharedPreferences("MOROwayAnimServerNote", MODE_PRIVATE)
        val lastShownVersionNote =settings.getString("versionNoteName", Globals.VERSION_NAME)
        val showVersionNoteAnyway = settings.getBoolean("versionNoteShowAnyWay", false)
        if (serverMsgSettings.getInt(
                "id",
                0
            ) > 0 && System.currentTimeMillis() / 1000L < serverMsgSettings.getLong("validUntil", 0)
        ) {
            val versionNote = Dialog(this, R.style.versionNoteDialog)
            val versionNoteBinding = DialogPopupBinding.inflate(
                layoutInflater
            )
            versionNote.setContentView(versionNoteBinding.root)
            versionNote.setTitle(serverMsgSettings.getString("title", ""))
            versionNote.window!!
                .setLayout(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT
                )
            versionNoteBinding.popupMainText.text = serverMsgSettings.getString("text", "")
            versionNoteBinding.showAgainContainer.visibility = View.VISIBLE
            versionNoteBinding.showAgainText.visibility = View.VISIBLE
            try {
                val linkToServer = Uri.parse(serverMsgSettings.getString("link", null))
                versionNoteBinding.linkbutton.visibility = View.VISIBLE
                versionNoteBinding.linkbutton.setOnClickListener {
                    val intent = Intent(Intent.ACTION_VIEW)
                    intent.data = linkToServer
                    startActivity(intent)
                }
            } catch (exception: NullPointerException) {
                exception.printStackTrace()
            }
            val imageSrc = serverMsgSettings.getString("image", null)
            if (imageSrc != null && imageSrc.isNotEmpty()) {
                Picasso.get().load(imageSrc).into(versionNoteBinding.versioNoteImage)
                versionNoteBinding.versioNoteImage.visibility = View.VISIBLE
                val imageLink = serverMsgSettings.getString("imageLink", null)
                if (imageLink != null && imageLink.isNotEmpty()) {
                    versionNoteBinding.versioNoteImage.setOnClickListener {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW)
                            intent.data = Uri.parse(imageLink)
                            startActivity(intent)
                        } catch (exception: NullPointerException) {
                            exception.printStackTrace()
                        }
                    }
                }
            }
            val imageSrcBackground = serverMsgSettings.getString("backgroundImage", null)
            if (imageSrcBackground != null && imageSrcBackground.isNotEmpty()) {
                Picasso.get().load(imageSrcBackground)
                    .into(versionNoteBinding.versioNoteBackgroundImage)
                versionNoteBinding.versioNoteBackgroundImage.visibility = View.VISIBLE
            }
            versionNoteBinding.button.setOnClickListener {
                if (!versionNoteBinding.showAgain.isChecked) {
                    val serverMsgSettingsEditor = serverMsgSettings.edit()
                    serverMsgSettingsEditor.putInt("id", 0)
                    serverMsgSettingsEditor.apply()
                }
                versionNote.dismiss()
            }
            versionNote.show()
        } else if (lastShownVersionNote != Globals.VERSION_NAME && Globals.SHOW_UPDATE_NOTE || showVersionNoteAnyway) {
            val versionNote = Dialog(this, R.style.versionNoteDialog)
            val versionNoteBinding = DialogPopupBinding.inflate(
                layoutInflater
            )
            versionNote.setContentView(versionNoteBinding.root)
            versionNote.setTitle(getString(R.string.d_update_title, Globals.VERSION_NAME))
            versionNote.window!!
                .setLayout(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT
                )
            versionNoteBinding.popupMainText.text =
                getString(R.string.d_update_text, getString(R.string.d_update_changelog))
            versionNoteBinding.button.setOnClickListener {
                settingsEditor.putString("versionNoteName", Globals.VERSION_NAME)
                settingsEditor.remove("versionNoteShowAnyWay")
                settingsEditor.apply()
                versionNote.dismiss()
            }
            versionNote.show()
        }
    }

    public override fun onResume() {
        super.onResume()
        lockStartActivity(this)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (resources.configuration.orientation == Configuration.ORIENTATION_PORTRAIT) {
            try {
                portraitPictureZoom!!.onTouchEvent(event)
                portraitPictureSwipe!!.onTouchEvent(event)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return true
    }

    private fun updateImageSettings() {
        val portraitPictureLimit = 6
        if (portraitPictureCurrent < 0) {
            portraitPictureCurrent = portraitPictureLimit - 1
        } else if (portraitPictureCurrent >= portraitPictureLimit) {
            portraitPictureCurrent = 0
        }
        portraitPictureSettingsEditor!!.putInt("CSpic", portraitPictureCurrent)
        portraitPictureSettingsEditor!!.putBoolean("CSpicBigSize", portraitPictureBig)
        portraitPictureSettingsEditor!!.apply()
    }

    private fun resetImage() {
        portraitPictureBigAndZoomed = false
        portraitPictureZoomOffsetX = 0f
        portraitPictureZoomOffsetY = 0f
        binding!!.bigStylePictures!!.scaleX = 1f
        binding!!.bigStylePictures!!.scaleY = 1f
        binding!!.bigStylePictures!!.translationX = portraitPictureZoomOffsetX
        binding!!.bigStylePictures!!.translationY = portraitPictureZoomOffsetY
        if (portraitPictureBig) {
            portraitPictureLayoutParams!!.removeRule(RelativeLayout.BELOW)
            binding!!.bigStylePictures!!.layoutParams = portraitPictureLayoutParams
            binding!!.bigStylePictures!!.scaleType = ImageView.ScaleType.CENTER_CROP
            binding!!.bigStylePictures!!.setPadding(0, 0, 0, 0)
            binding!!.root.setPadding(0, 0, 0, 0)
        } else {
            portraitPictureLayoutParams!!.addRule(RelativeLayout.BELOW, R.id.ImageHandler)
            binding!!.bigStylePictures!!.layoutParams = portraitPictureLayoutParams
            binding!!.bigStylePictures!!.scaleType = ImageView.ScaleType.FIT_CENTER
            binding!!.bigStylePictures!!.setPadding(0, 0, 0, 10)
            binding!!.root.setPadding(dimen, dimen, dimen, dimen)
        }
    }

    private fun setImage() {
        when (portraitPictureCurrent) {
            5 -> binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic6cs)
            4 -> binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic5cs)
            3 -> if (portraitPictureBig) {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic4csbigstyle)
            } else {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic4cs)
            }
            2 -> if (portraitPictureBig) {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic3csbigstyle)
            } else {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic3cs)
            }
            1 -> binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic2cs)
            else -> if (portraitPictureBig) {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic1csbigstyle)
            } else {
                binding!!.bigStylePictures!!.setImageResource(R.drawable.screen1pic1cs)
            }
        }
    }

    fun nextImage() {
        ++portraitPictureCurrent
        updateImageSettings()
        resetImage()
        setImage()
    }

    fun prevImage() {
        --portraitPictureCurrent
        updateImageSettings()
        resetImage()
        setImage()
    }

    fun setZoomOffset() {
        val xMax =
            ((binding!!.bigStylePictures!!.scaleX - 1) * (binding!!.bigStylePictures!!.width / 2))
        if (portraitPictureZoomOffsetX >= xMax) {
            portraitPictureZoomOffsetX = xMax
        } else if (portraitPictureZoomOffsetX <= -xMax) {
            portraitPictureZoomOffsetX = -xMax
        }
        val yMax =
            ((binding!!.bigStylePictures!!.scaleY - 1) * (binding!!.bigStylePictures!!.height / 2))
        if (portraitPictureZoomOffsetY >= yMax) {
            portraitPictureZoomOffsetY = yMax
        } else if (portraitPictureZoomOffsetY <= -yMax) {
            portraitPictureZoomOffsetY = -yMax
        }
        binding!!.bigStylePictures!!.translationX = portraitPictureZoomOffsetX
        binding!!.bigStylePictures!!.translationY = portraitPictureZoomOffsetY
    }

    private inner class ScaleListener : SimpleOnScaleGestureListener() {
        override fun onScale(detector: ScaleGestureDetector): Boolean {
            var imageScale = detector.scaleFactor
            if (imageScale > 1 && !portraitPictureBig) {
                portraitPictureBig = true
                updateImageSettings()
                resetImage()
                setImage()
            } else if (imageScale > 0 && imageScale < 1 && binding!!.bigStylePictures!!.scaleX <= 1 && portraitPictureBig && !portraitPictureBigAndZoomed) {
                portraitPictureBig = false
                portraitPictureAllowZoom = false
                updateImageSettings()
                resetImage()
                setImage()
            } else if ((imageScale > 1 || binding!!.bigStylePictures!!.scaleX > 1) && portraitPictureBig && portraitPictureAllowZoom) {
                val imageZoomMaxScale = 3.25f
                portraitPictureBigAndZoomed = true
                binding!!.bigStylePictures!!.scaleType = ImageView.ScaleType.MATRIX
                if (imageScale * binding!!.bigStylePictures!!.scaleX.coerceAtLeast(binding!!.bigStylePictures!!.scaleY) > imageZoomMaxScale
                ) {
                    imageScale =
                        imageZoomMaxScale / binding!!.bigStylePictures!!.scaleX.coerceAtLeast(
                            binding!!.bigStylePictures!!.scaleY
                        )
                }
                binding!!.bigStylePictures!!.scaleX =
                    1f.coerceAtLeast(imageScale * binding!!.bigStylePictures!!.scaleX)
                binding!!.bigStylePictures!!.scaleY =
                    1f.coerceAtLeast(imageScale * binding!!.bigStylePictures!!.scaleY)
                setZoomOffset()
            }
            return true
        }

        override fun onScaleEnd(detector: ScaleGestureDetector) {
            portraitPictureAllowZoom = portraitPictureBig
            portraitPictureBigAndZoomed = false
        }
    }

    private inner class SwipeListener : SimpleOnGestureListener() {
        override fun onFling(
            e1: MotionEvent,
            e2: MotionEvent,
            velocityX: Float,
            velocityY: Float
        ): Boolean {
            val swipeMinDistance = width / 3
            val swipeMaxOffPath = width / 5
            val swipeThresholdVelocity = 222
            val imageZoomMinScale = 1.7
            if (portraitPictureBig && binding!!.bigStylePictures!!.scaleX >= imageZoomMinScale && binding!!.bigStylePictures!!.scaleY >= imageZoomMinScale) {
                portraitPictureZoomOffsetX -= e1.x - e2.x
                portraitPictureZoomOffsetY -= e1.y - e2.y
                setZoomOffset()
            } else if (e1.x - e2.x > swipeMinDistance && abs(velocityX) > swipeThresholdVelocity && abs(e1.y - e2.y) < swipeMaxOffPath
            ) {
                nextImage()
            } else if (e2.x - e1.x > swipeMinDistance && abs(velocityX) > swipeThresholdVelocity && abs(e1.y - e2.y) < swipeMaxOffPath
            ) {
                prevImage()
            } else {
                resetImage()
            }
            return false
        }

        override fun onDown(e: MotionEvent): Boolean {
            return true
        }
    }
}
