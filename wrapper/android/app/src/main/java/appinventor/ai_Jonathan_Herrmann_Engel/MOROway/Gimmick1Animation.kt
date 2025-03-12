package appinventor.ai_Jonathan_Herrmann_Engel.MOROway

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ImageDecoder
import android.graphics.Paint
import android.graphics.drawable.BitmapDrawable
import android.os.Build.VERSION.SDK_INT
import android.os.Handler
import android.os.Looper
import android.util.AttributeSet
import android.view.MotionEvent
import androidx.core.graphics.drawable.toDrawable
import androidx.core.graphics.scale

class Gimmick1Animation(context: Context, attrs: AttributeSet?) :
    androidx.appcompat.widget.AppCompatImageView(context, attrs) {
    private val h: Handler = Handler(Looper.getMainLooper())
    private val r = Runnable { this.invalidate() }
    private var hedgehog: BitmapDrawable? = null
    private var snail: BitmapDrawable? = null
    private var smallHedgehog1: BitmapDrawable? = null
    private var smallHedgehog2: BitmapDrawable? = null
    private var smallHedgehog3: BitmapDrawable? = null
    private var apple: BitmapDrawable? = null
    private var replay: Paint? = null
    private var hedgehogX = 0.0
    private var hedgehogY = 0.0
    private var snailX = 0.0
    private var snailY = 0.0
    private var hedgehogSmall1X = 0.0
    private var hedgehogSmall1Y = 0.0
    private var hedgehogSmall2X = 0.0
    private var hedgehogSmall2Y = 0.0
    private var hedgehogSmall3X = 0.0
    private var hedgehogSmall3Y = 0.0
    private var appleX = 0.0
    private var appleY = 0.0
    private var replayX = 0.0
    private var replayY = 0.0
    private var hedgehogVelocityX = 0.0
    private var hedgehogVelocityY = 0.0
    private var hedgehogEndVelocityY = 0.0
    private var hedgehogEndMinY = 0.0
    private var hedgehogEndMaxY = 0.0
    private var snailVelocityX = 0.0
    private var snailVelocityY = 0.0
    private var hedgehogSmall1VelocityX = 0.0
    private var hedgehogSmall1EndVelocityY = 0.0
    private var hedgehogSmall1EndMinY = 0.0
    private var hedgehogSmall1EndMaxY = 0.0
    private var hedgehogSmall2VelocityX = 0.0
    private var hedgehogSmall2EndVelocityY = 0.0
    private var hedgehogSmall2EndMinY = 0.0
    private var hedgehogSmall2EndMaxY = 0.0
    private var hedgehogSmall3VelocityX = 0.0
    private var hedgehogSmall3EndVelocityY = 0.0
    private var hedgehogSmall3EndMinY = 0.0
    private var hedgehogSmall3EndMaxY = 0.0
    private var hedgehogEndHasReachedMin = false
    private var appleVelocityX = 0.0
    private var appleVelocityY = 0.0
    private var appleXMin = 0.0
    private var appleXMax = 0.0
    private var clicked = false
    private var hedgehogRun = false
    private var snailRun = false
    private var hedgehogSmall1Run = false
    private var smallHedgehog2Run = false
    private var smallHedgehog3Run = false
    private var appleRun = false
    private var hedgehogEndRun = false
    private var replayRun = false
    private var firstRun = true

    private fun reset() {
        hedgehogX = 0.0
        hedgehogY = 0.5 * height
        snailX = 0.75 * width
        snailY = 0.75 * height
        hedgehogSmall1X = -smallHedgehog1!!.bitmap.width.toDouble()
        hedgehogSmall2X = -smallHedgehog2!!.bitmap.width.toDouble()
        hedgehogSmall3X = -smallHedgehog3!!.bitmap.width.toDouble()
        appleY = -apple!!.bitmap.height.toDouble()
        replayX = width * 0.5
        replayY = height * 0.3
        hedgehogVelocityX = 0.003 * width
        hedgehogVelocityY = 0.00055 * height
        hedgehogEndVelocityY = 0.005 * width
        hedgehogEndHasReachedMin = false
        snailVelocityX = 0.0075 * width
        snailVelocityY = 0.0005 * width
        hedgehogSmall1VelocityX = 0.0025 * width
        hedgehogSmall2VelocityX = 0.00125 * width
        hedgehogSmall3VelocityX = 0.0005 * width
        hedgehogSmall1EndVelocityY = 0.002 * width
        hedgehogSmall2EndVelocityY = 0.0025 * width
        hedgehogSmall3EndVelocityY = 0.0015 * width
        appleVelocityX = 0.002 * width
        appleVelocityY = 0.0075 * width
        hedgehogRun = false
        snailRun = false
        hedgehogSmall1Run = false
        smallHedgehog2Run = false
        smallHedgehog3Run = false
        appleRun = false
        hedgehogEndRun = false
        clicked = false
        replayRun = false
    }

    private fun getHedgehogFinalY(
        currentY: Double,
        currentDiff: Double,
        currentMax: Double,
        currentMin: Double
    ): Double {
        var diff = -Math.random() * currentDiff
        if (hedgehogEndHasReachedMin) {
            diff *= -1.0
        }
        if (currentY + diff >= currentMax) {
            diff = currentMax - currentY
        } else if (currentY + diff <= currentMin) {
            diff = currentMin - currentY
        }
        return currentY + diff
    }

    private fun getHeight(width: Int, srcWidth: Int, srcHeight: Int): Int {
        return width * srcHeight / srcWidth
    }

    private fun decodeBitmap(resId: Int): Bitmap {
        return if (SDK_INT >= 28) {
            ImageDecoder.decodeBitmap(ImageDecoder.createSource(resources, resId))
        } else {
            BitmapFactory.decodeResource(resources, resId)
        }
    }

    override fun onDraw(hedgehogCanvas: Canvas) {
        if (firstRun) {
            val unscaledSnail = decodeBitmap(R.drawable.gimmick1_4)
            val scaledSnailWidth = width / 8
            val scaledSnail = unscaledSnail.scale(
                scaledSnailWidth,
                getHeight(scaledSnailWidth, unscaledSnail.width, unscaledSnail.height),
                false
            )
            snail = scaledSnail.toDrawable(resources)
            val unscaledHedgehog = decodeBitmap(R.drawable.gimmick1_0)
            val scaledHedgehogWidth = width / 3
            val scaledHedgehog = unscaledHedgehog.scale(
                scaledHedgehogWidth,
                getHeight(scaledHedgehogWidth, unscaledHedgehog.width, unscaledHedgehog.height),
                false
            )
            hedgehog = scaledHedgehog.toDrawable(resources)
            val scaledSmallHedgehogWidth = width / 8
            val unscaledSmallHedgehog1 = decodeBitmap(R.drawable.gimmick1_1)
            val scaledSmallHedgehog1 = unscaledSmallHedgehog1.scale(
                scaledSmallHedgehogWidth, getHeight(
                    scaledSmallHedgehogWidth,
                    unscaledSmallHedgehog1.width,
                    unscaledSmallHedgehog1.height
                ), false
            )
            smallHedgehog1 = scaledSmallHedgehog1.toDrawable(resources)
            val unscaledSmallHedgehog2 = decodeBitmap(R.drawable.gimmick1_2)
            val scaledSmallHedgehog2 = unscaledSmallHedgehog2.scale(
                scaledSmallHedgehogWidth, getHeight(
                    scaledSmallHedgehogWidth,
                    unscaledSmallHedgehog2.width,
                    unscaledSmallHedgehog2.height
                ), false
            )
            smallHedgehog2 = scaledSmallHedgehog2.toDrawable(resources)
            val unscaledSmallHedgehog3 = decodeBitmap(R.drawable.gimmick1_3)
            val scaledSmallHedgehog3 = unscaledSmallHedgehog3.scale(
                scaledSmallHedgehogWidth, getHeight(
                    scaledSmallHedgehogWidth,
                    unscaledSmallHedgehog3.width,
                    unscaledSmallHedgehog3.height
                ), false
            )
            smallHedgehog3 = scaledSmallHedgehog3.toDrawable(resources)
            val unscaledApple = decodeBitmap(R.drawable.gimmick1_5)
            val scaledAppleWidth = width / 14
            val scaledApple = unscaledApple.scale(
                scaledAppleWidth,
                getHeight(scaledAppleWidth, unscaledApple.width, unscaledApple.height),
                false
            )
            apple = scaledApple.toDrawable(resources)
            replay = Paint()
            replay!!.textSize =
                (height / 5f).coerceAtMost((width / resources.getString(R.string.a_g1_again).length).toFloat())
            replay!!.textAlign = Paint.Align.CENTER
            reset()
            firstRun = false
        }

        //Hedgehog
        if (hedgehogRun) {
            hedgehogX += hedgehogVelocityX
            hedgehogY += hedgehogVelocityY
            if (hedgehogX + hedgehog!!.bitmap.width >= snailX) {
                hedgehogVelocityX = 0.0
                hedgehogVelocityY = 0.0
                hedgehogSmall1Y =
                    hedgehogY + hedgehog!!.bitmap.height - smallHedgehog1!!.bitmap.height
                hedgehogSmall2Y =
                    hedgehogY + hedgehog!!.bitmap.height - smallHedgehog2!!.bitmap.height
                hedgehogSmall3Y =
                    hedgehogY + hedgehog!!.bitmap.height - smallHedgehog3!!.bitmap.height
                val hedgehogMin = 0.085 * height
                hedgehogEndMinY = hedgehogY - hedgehogMin
                hedgehogEndMaxY = hedgehogY
                hedgehogSmall1EndMinY = hedgehogSmall1Y - hedgehogMin
                hedgehogSmall1EndMaxY = hedgehogSmall1Y
                hedgehogSmall2EndMinY = hedgehogSmall2Y - hedgehogMin
                hedgehogSmall2EndMaxY = hedgehogSmall2Y
                hedgehogSmall3EndMinY = hedgehogSmall3Y - hedgehogMin
                hedgehogSmall3EndMaxY = hedgehogSmall3Y
                appleX = hedgehogX + hedgehog!!.bitmap.width + 0.03 * width + appleVelocityX
                appleXMax = appleX + appleVelocityX
                appleXMin = appleX - appleVelocityX
                hedgehogRun = false
                snailRun = true
            }
        }

        //Snail
        if (snailRun) {
            snailX += snailVelocityX
            snailY += snailVelocityY
            if (snailX > width) {
                snailRun = false
                hedgehogSmall1Run = true
            }
        }

        //Small Hedgehogs
        val smallHedgehogDistance = width / 100
        if (hedgehogSmall1Run) {
            if (hedgehogSmall1X + smallHedgehog1!!.bitmap.width + smallHedgehogDistance >= hedgehogX) {
                hedgehogSmall1X = hedgehogX - smallHedgehog1!!.bitmap.width - smallHedgehogDistance
                hedgehogSmall1Run = false
                smallHedgehog2Run = true
            } else {
                hedgehogSmall1X += hedgehogSmall1VelocityX
            }
        }
        if (smallHedgehog2Run) {
            if (hedgehogSmall2X + smallHedgehog2!!.bitmap.width + smallHedgehogDistance >= hedgehogSmall1X) {
                hedgehogSmall2X =
                    hedgehogSmall1X - smallHedgehog2!!.bitmap.width - smallHedgehogDistance
                smallHedgehog2Run = false
                smallHedgehog3Run = true
            } else {
                hedgehogSmall2X += hedgehogSmall2VelocityX
            }
        }
        if (smallHedgehog3Run) {
            if (hedgehogSmall3X + smallHedgehog3!!.bitmap.width + smallHedgehogDistance >= hedgehogSmall2X) {
                hedgehogSmall3X =
                    hedgehogSmall2X - smallHedgehog3!!.bitmap.width - smallHedgehogDistance
                smallHedgehog3Run = false
                appleRun = true
            } else {
                hedgehogSmall3X += hedgehogSmall3VelocityX
            }
        }

        //Apple
        if (appleRun) {
            if (appleY >= hedgehogY + hedgehog!!.bitmap.height - apple!!.bitmap.height) {
                appleRun = false
                hedgehogEndRun = true
            } else {
                var diff = Math.random() * appleVelocityX
                if (Math.random() >= 0.5) {
                    diff *= -1.0
                }
                if (appleX + diff > appleXMax) {
                    diff = appleXMax - appleX
                } else if (appleX + diff < appleXMin) {
                    diff = appleXMin - appleX
                }
                appleX += diff
                appleY += appleVelocityY
            }
        }

        //Hedgehogs jump
        if (hedgehogEndRun) {
            if (hedgehogEndHasReachedMin && hedgehogY >= hedgehogEndMaxY && hedgehogSmall1Y >= hedgehogSmall1EndMaxY && hedgehogSmall2Y >= hedgehogSmall2EndMaxY && hedgehogSmall3Y >= hedgehogSmall3EndMaxY) {
                hedgehogEndRun = false
                replayRun = true
                clicked = false
            } else {
                hedgehogY = getHedgehogFinalY(
                    hedgehogY,
                    hedgehogEndVelocityY,
                    hedgehogEndMaxY,
                    hedgehogEndMinY
                )
                hedgehogSmall1Y = getHedgehogFinalY(
                    hedgehogSmall1Y,
                    hedgehogSmall1EndVelocityY,
                    hedgehogSmall1EndMaxY,
                    hedgehogSmall1EndMinY
                )
                hedgehogSmall2Y = getHedgehogFinalY(
                    hedgehogSmall2Y,
                    hedgehogSmall2EndVelocityY,
                    hedgehogSmall2EndMaxY,
                    hedgehogSmall2EndMinY
                )
                hedgehogSmall3Y = getHedgehogFinalY(
                    hedgehogSmall3Y,
                    hedgehogSmall3EndVelocityY,
                    hedgehogSmall3EndMaxY,
                    hedgehogSmall3EndMinY
                )
                if (hedgehogY <= hedgehogEndMinY) {
                    hedgehogEndHasReachedMin = true
                }
            }
        }
        hedgehogCanvas.drawBitmap(snail!!.bitmap, snailX.toFloat(), snailY.toFloat(), null)
        hedgehogCanvas.drawBitmap(hedgehog!!.bitmap, hedgehogX.toFloat(), hedgehogY.toFloat(), null)
        hedgehogCanvas.drawBitmap(
            smallHedgehog1!!.bitmap,
            hedgehogSmall1X.toFloat(),
            hedgehogSmall1Y.toFloat(),
            null
        )
        hedgehogCanvas.drawBitmap(
            smallHedgehog2!!.bitmap,
            hedgehogSmall2X.toFloat(),
            hedgehogSmall2Y.toFloat(),
            null
        )
        hedgehogCanvas.drawBitmap(
            smallHedgehog3!!.bitmap,
            hedgehogSmall3X.toFloat(),
            hedgehogSmall3Y.toFloat(),
            null
        )
        hedgehogCanvas.drawBitmap(apple!!.bitmap, appleX.toFloat(), appleY.toFloat(), null)
        if (replayRun) {
            hedgehogCanvas.drawText(
                resources.getString(R.string.a_g1_again),
                replayX.toFloat(),
                replayY.toFloat(),
                replay!!
            )
        }
        h.postDelayed(r, 10)
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_DOWN && !clicked) {
            reset()
            clicked = true
            hedgehogRun = true
        }
        return true
    }
}
