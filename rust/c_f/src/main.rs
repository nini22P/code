use std::io;

fn main() {
    loop {
        println!("1. ℃  to ℉");
        println!("2. ℉  to ℃");
        println!("3. exit");

        let choose = get_input();

        if choose == 0.0 {
            println!("\n");
            continue;
        } else if choose == 1.0 {
            loop {
                let c = get_input();
                if c == 0.0 {
                    continue;
                } else {
                    let f = c_to_f(c);
                    println!("{f}℉\n");
                    break;
                }
            }
            continue;
        } else if choose == 2.0 {
            loop {
                let f = get_input();
                if f == 0.0 {
                    continue;
                } else {
                    let c = f_to_c(f);
                    println!("{c}℃\n");
                    break;
                }
            }
            continue;
        } else if choose == 3.0 {
            break;
        }
    }
}

fn get_input() -> f32 {
    let mut input = String::new();

    io::stdin().read_line(&mut input).expect("failed read");

    let input = match input.trim().parse() {
        Ok(num) => num,
        Err(_) => 0.0,
    };

    input
}

fn c_to_f(c: f32) -> f32 {
    1.8 * c + 32.0
}

fn f_to_c(f: f32) -> f32 {
    (f - 32.0) / 1.8
}
