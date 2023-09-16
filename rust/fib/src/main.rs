use std::io;

fn main() {
    fn get_input_num() -> i32 {
        let mut input = String::new();

        io::stdin().read_line(&mut input).expect("failed read");

        let input = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => get_input_num(),
        };

        input
    }

    fn fibonacci(n: i32) -> i32 {
        const MOD: i32 = 1000000007;

        if n < 2 {
            return n;
        }

        let mut p;
        let mut q = 0;
        let mut r = 1;

        for _l in 2..=n {
            p = q;
            q = r;
            r = (p + q) % MOD;
        }

        r
    }

    loop {
        println!("Input an number: ");
        let input = get_input_num();
        println!("fibonacci number is {}", fibonacci(input));
    }
}
