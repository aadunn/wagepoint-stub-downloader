const baseUrl = window.location.origin;

const getStubIds = () => {
	console.log('getting stubs...');

	let payrollHistoryDiv = document.querySelectorAll('div.payroll-history')[0];
	let childrenArray = Array.prototype.slice.call(payrollHistoryDiv.children);

	let payrollTable = childrenArray.findLast((child) => child.classList.contains('table-body'));
	let inputs = Array.prototype.slice.call(payrollTable.getElementsByTagName('input'))

	let stubIds = inputs.map((element) => element.getAttribute('onclick').replace(/\D/g, ""));

	return stubIds;
}

const getPdfs = (stubsIds) => {
	let urls = [];

	let requests = stubIds.map((id) => {
		let data = {
	  	method: 'getPayStub',
			id: id
		};

		return fetch(`${baseUrl}/cfcs/realtime.cfc`, {
		  method: 'POST',
		  headers: {
		  	'Accept': 'application/json',
		  	'Content-Type': 'application/x-www-form-urlencoded',
		  },
		  mode: "cors",
    	credentials: "same-origin",
		  body: JSON.stringify(data),
		})
		.then((data) => data.json())
		.then((data) => urls.push(`https://secure.wagepoint.com/${data.PDF}`));
	});

	Promise.all(requests).then(() => {
		var link = document.createElement('a');

		link.setAttribute('download', null);
		link.style.display = 'none';	

		document.body.appendChild(link);

		for (var i = 0; i < urls.length; i++) {
			link.setAttribute('href', urls[i]);
			link.click();
		}

		document.body.removeChild(link);

		console.log('finished!');
	});
}

const stubIds = getStubIds();
getPdfs(stubsIds);
