package com.example.progrmacionmovil

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.example.progrmacionmovil.ui.theme.ProgrmacionMovilTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ProgrmacionMovilTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun Greeting(modifier: Modifier = Modifier) {
    Text(
        text = "PONTE A TRABAJAR!",
        modifier = modifier
            .fillMaxSize()  // Ocupa toda la pantalla
            .wrapContentSize(), // Centra el texto
        fontSize = 32.sp, // Aumenta el tamaño del texto
        textAlign = TextAlign.Center // Centra el texto horizontalmente
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    ProgrmacionMovilTheme {
        Greeting()
    }
}
