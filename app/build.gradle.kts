

plugins {
    id("com.android.application")
    alias(libs.plugins.google.services)
    kotlin("android")
}


android {
    namespace   = "com.YassinSolutions.PlateShare"
    compileSdk  = 34

    defaultConfig {
        applicationId = "com.YassinSolutions.PlateShare"
        minSdk        = 21
        targetSdk     = 34
        versionCode   = 1
        versionName   = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

dependencies {
    implementation("org.apache.commons:commons-text")
    implementation(project(":utilities"))
    implementation(platform("com.google.firebase:firebase-bom:32.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    mplementation 'com.google.firebase:firebase-auth-ktx'
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-ml-modeldownloader")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")
    implementation("com.google.firebase:firebase-compose-auth:1.0.0")
    implementation ("com.google.android.gms:play-services-auth:16.0.1")
}
apply plugin: 'com.google.gms.google-services'
