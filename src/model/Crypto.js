const Crypto = function(data) {
    //Properties 
    this.data = data
    this.errors = []
}

//validation
Crypto.prototype.validateUserInput = function () {
    if(this.data == "") {
        this.errors.push("Please enter a Crypto Currency name.")
    }
}

module.exports = Crypto