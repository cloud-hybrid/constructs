const Title = (input: string) => {
    // Split into an array of strings upon empty character
    const splitter = input.split(" ");

    let index = 0;

    // Loop through each element of the array and capitalize the first letter
    for (index; index < splitter.length; index++) {
        splitter[index] = splitter[index].charAt(0).toUpperCase() + splitter[index].slice(1);
    }

    return splitter.join(" ");
}

export { Title };

export default Title;