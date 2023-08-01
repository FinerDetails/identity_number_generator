window.onload = () => {
	//Adds zeroes in front of numbers (9 => 09)
	const setLength = (string, desiredLength) => {
		while (string.length < desiredLength) {
			string = "0" + string
		}
		return string
	}
	//returns a random string between min and max parameters
	const randomStringInRangeOf = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min).toString()
	}
	//returns a random integer between min and max parameters
	const randomIntInRangeOf = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	//randomizes a separator based on the given parameters
	const returnSeparator = (minYear, maxYear, isExpat) => {
		let separators
		const minCentury = parseInt(minYear.slice(1, 2))
		const maxCentury = parseInt(maxYear.slice(1, 2))
		const separatorsA = ["+", "-"]
		let separatorsB = ["+", "-", "A"]
		let separatorsC = ["-", "A"]
		const separatorsD = ["+"]
		let separatorsE = ["-"]
		let separatorsF = ["A"]

		if (isExpat) {
			separatorsB = [
				"+",
				"+",
				"+",
				"+",
				"+",
				"Y",
				"X",
				"W",
				"V",
				"U",
				"B",
				"C",
				"D",
				"E",
				"F",
			] // + is added 5 times to give an equal 1/3 chance for all centuries.
			separatorsC = ["Y", "X", "W", "V", "U", "B", "C", "D", "E", "F"]
			separatorsE = ["Y", "X", "W", "V", "U"]
			separatorsF = ["B", "C", "D", "E", "F"]
		}
		switch (minCentury - maxCentury) {
			case -1:
				separators = separatorsA
				break
			case 8:
				separators = separatorsB
				break
			case 9:
				separators = separatorsC
				break
			default:
				switch (minCentury) {
					case 8:
						separators = separatorsD
						break
					case 9:
						separators = separatorsE
						break
					default:
						separators = separatorsF
				}
		}
		return separators[randomIntInRangeOf(0, separators.length - 1)]
	}
	//returs a value based on given number
	const returnCheckMark = number => {
		if (number > 9) {
			switch (number) {
				case 10:
					number = "A"
					break
				case 11:
					number = "B"
					break
				case 12:
					number = "C"
					break
				case 13:
					number = "D"
					break
				case 14:
					number = "E"
					break
				case 15:
					number = "F"
					break
				case 16:
					number = "H"
					break
				case 17:
					number = "J"
					break
				case 18:
					number = "K"
					break
				case 19:
					number = "L"
					break
				case 20:
					number = "M"
					break
				case 21:
					number = "N"
					break
				case 22:
					number = "P"
					break
				case 23:
					number = "R"
					break
				case 24:
					number = "S"
					break
				case 25:
					number = "T"
					break
				case 26:
					number = "U"
					break
				case 27:
					number = "V"
					break
				case 28:
					number = "W"
					break
				case 29:
					number = "X"
					break
				default:
					number = "Y"
			}
		}
		return number
	}

	const isLeapYear = yy => {
		if (
			(yy % 4 === 0 && yy % 100 !== 0) ||
			(yy % 100 === 0 && yy % 400 === 0)
		) {
			return true
		}
		return false
	}
	//returns an individual number based on gender. For females, an even number and for males an uneven number.
	//numbers 000, 001 and 900–999 are forbidden.
	const returnIndividualNumber = isFemale => {
		let individualNumber = setLength(randomIntInRangeOf(2, 899), 3)
		if (isFemale) {
			while (individualNumber % 2 === 1) {
				individualNumber = setLength(randomIntInRangeOf(2, 899), 3)
			}
		} else {
			while (individualNumber % 2 === 0) {
				individualNumber = setLength(randomIntInRangeOf(2, 899), 3)
			}
		}
		return individualNumber.toString()
	}

	//event listener for the generate button
	const handleGeneratorFormSubmit = event => {
		event.preventDefault()
		const maxDate = document.getElementById("maxDate").value
		const minDate = document.getElementById("minDate").value
		const isFemale = document.querySelector(
			'input[name="isFemale"]:checked'
		).value
		const isExpat = document.getElementById("isExpat").checked
		const dateData = convertDate(minDate, maxDate)

		document.getElementById("output").innerHTML = generateIdentityNumber(
			dateData,
			isExpat,
			isFemale
		)
	}
	//converts date from the html date input to integers
	const convertDate = (minDate, maxDate) => {
		const minDateObject = new Date(minDate)
		const minYear = minDateObject.getFullYear()
		const minMonth = minDateObject.getMonth() + 1
		const minDay = minDateObject.getDate()

		const maxDateObject = new Date(maxDate)
		const maxYear = maxDateObject.getFullYear()
		const maxMonth = maxDateObject.getMonth() + 1
		const maxDay = maxDateObject.getDate()
		return {
			maxYearString: maxYear.toString(),
			minYearString: minYear.toString(),
			maxYearInt: maxYear,
			minYearInt: minYear,
			maxMonth,
			minMonth,
			maxDay,
			minDay,
		}
	}

	//puts together the identity number
	const generateIdentityNumber = (dateData, isExpat, isFemale) => {
		const year = randomStringInRangeOf(dateData.minYearInt, dateData.maxYearInt)
		const yy = setLength((year % 100).toString(), 2)
		// indicates years in date of birth
		const mm = setLength(
			randomStringInRangeOf(dateData.minMonth, dateData.maxMonth),
			2
		) //indicates months in date of birth
		const dd = setLength(
			randomStringInRangeOf(dateData.minDay, dateData.maxDay),
			2
		)
		//indicates days in date of birth
		const separator = returnSeparator(
			dateData.minYearString,
			dateData.maxYearString,
			isExpat
		) //indicates the century of birth
		let nnn = setLength(returnIndividualNumber(isFemale), 3) //individual number
		let t = returnCheckMark(parseInt(dd + mm + yy + nnn) % 31) //checkmark
		const identityNumber = dd + mm + yy + separator + nnn + t
		return identityNumber
	}

	//provides a the current day for maxDate input field as default
	const returnDefaultDateValue = () => {
		const date = new Date()
		let day = setLength(date.getDate().toString(), 2)
		let month = setLength((date.getMonth() + 1).toString(), 2)
		let year = date.getFullYear()
		return `${year}-${month}-${day}`
	}
	const defaultMaxDate = document.getElementById("maxDate")
	defaultMaxDate.value = returnDefaultDateValue()
	const generatorForm = document.getElementById("generatorForm")
	generatorForm.addEventListener("submit", handleGeneratorFormSubmit)
}
