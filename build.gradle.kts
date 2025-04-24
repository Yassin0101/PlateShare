// build.gradle.kts (Root project level)
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        // Use the same version of the plugin as in settings.gradle.kts
        classpath("com.android.tools.build:gradle:8.9.0") // Ensure consistency with settings.gradle.kts
        classpath ("com.google.gms:google-services:4.4.0")
        classpath(libs.google.services)
    }
}

plugins {
    kotlin("android") version "1.8.0" apply false
    id("com.google.gms.google-services") version "4.3.15" apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
