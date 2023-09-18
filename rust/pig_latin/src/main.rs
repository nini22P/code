use std::io;

fn is_english_text(text: &str) -> bool {
    for c in text.chars() {
        if !c.is_ascii_alphabetic() {
            println!("Please input alphabetic");
            return false;
        }
    }
    true
}

fn main() {
    loop {
        println!("Enter a word");

        let mut input = String::new();

        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line.");

        let input = input.trim();

        match input.len() != 0 && is_english_text(&input) {
            false => continue,
            true => {
                let (first, second) = input.split_at(1);

                match first {
                    "a" | "e" | "i" | "o" | "u" => {
                        let output = format!("{input}-hay");
                        println!("{}", output);
                    }
                    _ => {
                        let output = format!("{second}-{first}ay");
                        println!("{}", output);
                    }
                }
            }
        }
    }
}
