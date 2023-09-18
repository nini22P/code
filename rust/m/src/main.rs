use std::collections::HashMap;

fn main() {
    let nums = vec![2, 10, 6, 9, 5, 6, 10, 2, 5, 7, 10];

    println!("{:?}", nums);
    println!("Median is {}", get_median(&nums));
    println!("Mode is {:?}", get_mode(&nums));
}

fn get_median(nums: &Vec<i32>) -> f64 {
    let mut nums = nums.clone();
    nums.sort();

    let mid = nums.len() / 2;
    if nums.len() % 2 == 0 {
        return ((nums[mid - 1] + nums[mid]) / 2) as f64;
    } else {
        return nums[nums.len() / 2] as f64;
    }
}

fn get_mode(nums: &Vec<i32>) -> Vec<i32> {
    let mut map = HashMap::new();
    let mut mode: Vec<i32> = Vec::new();

    for num in nums {
        let count = map.entry(num).or_insert(0);
        *count += 1;
    }

    let max_count = map.values().max().unwrap();

    for (num, count) in map.iter() {
        if count == max_count {
            mode.push(**num);
        }
    }

    mode
}
