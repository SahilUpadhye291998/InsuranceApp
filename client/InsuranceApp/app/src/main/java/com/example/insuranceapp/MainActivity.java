package com.example.insuranceapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        EditText edtName = findViewById(R.id.edtName);
        EditText edtEmail = findViewById(R.id.edtEmail);
        EditText edtSecurityPin = findViewById(R.id.edtSecurityPin);

        Button button = findViewById(R.id.btnSubmit);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences preferences = getApplicationContext().getSharedPreferences("data", Context.MODE_PRIVATE);
                String value = preferences.getString("name","");
                Toast.makeText(MainActivity.this, value, Toast.LENGTH_SHORT).show();
                if(value.equals("")){
                    Toast.makeText(MainActivity.this, "No Value in SP", Toast.LENGTH_SHORT).show();
                }else{
                    startActivity(new Intent(MainActivity.this, DashBoard.class));
                }
            }
        });
    }
    private void insertNewRecord(){
        //TODO: add the user.
    }
}
