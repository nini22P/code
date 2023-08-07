use rand::Rng;
use std::{cmp::Ordering, io};

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    let mut guess_time = 0;

    // println!("The secret numer is: {secret_number}");

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line.");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            Ordering::Less => {
                println!("Too smaill!");
                guess_time += 1;
            }
            Ordering::Greater => {
                println!("Too big!");
                guess_time += 1;
            }
            Ordering::Equal => {
                println!("You win!");
                println!("Guess time: {guess_time}");
                break;
            }
        }
    }
}
