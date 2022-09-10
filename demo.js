const res = {
    id: 1,
    name: "Rwitesh",
    password: "hello"
}


// console.log(res)

const {password, ...result} = res;
console.log(result)

