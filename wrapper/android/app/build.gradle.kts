plugins {
    id("com.android.application")
}

android {
    compileSdk = 36
    defaultConfig {
        applicationId = "appinventor.ai_Jonathan_Herrmann_Engel.MOROway"
        minSdk = 28
        targetSdk = 36
        versionCode = 1003121
        versionName = "10.3.12"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        getByName("debug") {
            applicationIdSuffix = ".test"
        }
    }
    bundle {
        language {
            enableSplit = false
        }
    }
    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    namespace = "appinventor.ai_Jonathan_Herrmann_Engel.MOROway"
}

dependencies {
    val kotlinVersion = rootProject.extra.get("kotlinVersion") as String
    implementation("org.jetbrains.kotlin:kotlin-stdlib:$kotlinVersion")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("androidx.activity:activity-ktx:1.12.3")
    implementation("androidx.webkit:webkit:1.15.0")
    implementation("io.coil-kt.coil3:coil:3.3.0")
    implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
}

repositories {
    mavenCentral()
    google()
}
