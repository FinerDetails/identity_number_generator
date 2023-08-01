window.onload = () => {
	let isExpat = false
	//Converts DDMMYY format of identityNumber to a readable YYYY-MM-DD format for a Date constructor.
	//Also sets isExpat boolean to true if century marker is of expat type.
	const returnDateString = (identityNumber, mm) => {
		const dateArray = []
		const nineteens = ["-", "Y", "X", "W", "V", "U"]
		const twenties = ["A", "B", "C", "D", "E", "F"]
		const separator = identityNumber.slice(6, 7) //indicates the century of birth
		let century
		dateArray.push(identityNumber.slice(4, 6))
		dateArray.push(mm)
		dateArray.push(identityNumber.slice(0, 2))

		if (nineteens.find(symbol => symbol === separator)) {
			century = "19"
			if (separator !== "-") {
				isExpat = true
			}
		} else if (twenties.find(symbol => symbol === separator)) {
			century = "20"
			if (separator !== "A") {
				isExpat = true
			}
		} else {
			century = "18"
		}

		dateArray[0] = century + dateArray[0]
		return dateArray.join("-")
	}

	const isIdentityNumberFormatValid = identityNumber => {
		const regex = /^\d{6}[+\-a-fu-y]\d{3}[\da-fhj-npr-y]$/i
		return regex.test(identityNumber)
	}

	const isDateValid = (dateObj, mm) => {
		const isFormatValid = !isNaN(dateObj) //Any attempt to represent a time outside the valid range results in the Date object holding a timestamp value of NaN
		const isDayValid = dateObj.getMonth() + 1 === Number(mm)
		/*
	Because the constructor of dateObj automatically converts a too large date (eg.
	32.7.2023 to 1.8.2023), the isDateValid boolean compares if the mm variable from the identity number corresponds to the month
	from dateObj to determine the logical validity of the date.
	*/
		return isFormatValid && isDayValid
	}
	//checks that the individual number is within permitted range
	const isIndividualNumberValid = nnn => {
		const number = Number(nnn)
		if (2 < number && number < 900) {
			return true
		}
		return false
	}
	const returnSex = nnn => {
		if (nnn % 2 === 0) {
			return "female"
		}
		return "male"
	}
	const handleCheckerFormSubmit = event => {
		event.preventDefault()
		const identityNumber = document
			.getElementById("identityNumber")
			.value.toUpperCase()
		const mm = identityNumber.slice(2, 4) //month of the user, used also for checking of logical date validity
		const dateObj = new Date(returnDateString(identityNumber, mm))
		const nnn = identityNumber.slice(7, 10) //individual number

		if (
			isIdentityNumberFormatValid(identityNumber) &&
			isDateValid(dateObj, mm) &&
			isIndividualNumberValid(nnn)
		) {
			const birthday = `${dateObj.getDate()}.${
				dateObj.getMonth() + 1
			}.${dateObj.getFullYear()}`
			let age = `${new Date().getFullYear() - dateObj.getFullYear()}`
			let output = document.getElementById("output")
			output.innerHTML = `<div>
			<ul>
				<li>Birthday: ${birthday}</li>
				<li>Age: ${age}</li>
				<li>Expat: ${isExpat}</li>
				<li>Sex: ${returnSex(nnn)}</li>
				<li>Individual number: ${nnn}</li>
			</ul>
		</div>`
		} else {
			document.getElementById("identityNumber").value = ""
			output.innerHTML = `<div>
			<p>identity number ${identityNumber} is invalid</p>
		</div>`
		}
	}
	const checkerForm = document.getElementById("generatorForm")
	checkerForm.addEventListener("submit", handleCheckerFormSubmit)
}
