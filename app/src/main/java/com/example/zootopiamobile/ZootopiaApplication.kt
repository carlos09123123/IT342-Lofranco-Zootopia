package com.example.zootopiamobile

import android.app.Application
import android.content.Context

class ZootopiaApplication : Application() {
    companion object {
        lateinit var context: Context
            private set
    }

    override fun onCreate() {
        super.onCreate()
        context = applicationContext
    }
}