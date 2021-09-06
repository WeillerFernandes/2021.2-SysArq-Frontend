import React, { useState } from "react";

import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";

const hostApi = process.env.REACT_APP_URL_API_PUBLIC_WORKER;

const useStyles = makeStyles({
	fields: {
		marginTop: 20,
		marginBotton: 20,
		display: "block",
	},
});

export default function CreatePublicWorker() {
	const [publicWorkerName, setpublicWorkerName] = useState("");
	const [cpf, setCpf] = useState("");
	const [office, setOffice] = useState("");
	const [classWorker, setClassWorker] = useState("");
	const [capacity, setCapacity] = useState("");
	const [county, setCounty] = useState("");

	const classes = useStyles();

	const onClick = () => {
		axios
			.post(hostApi, {
				name: publicWorkerName,
				cpf,
				office,
				class_worker: classWorker,
				capacity,
				county,
			})
			.then(() => {})
			.catch(() => {});
	};

	const onChangePulicWorkerName = (event) => {
		setpublicWorkerName(event.target.value);
	};

	const onChangeCpf = (event) => {
		setCpf(event.target.value);
	};

	const onChangeOffice = (event) => {
		setOffice(event.target.value);
	};

	const onChangeClassWorker = (event) => {
		setClassWorker(event.target.value);
	};

	const onChangeCapacity = (event) => {
		setCapacity(event.target.value);
	};

	const onChangeCounty = (event) => {
		setCounty(event.target.value);
	};

	return (
		<div>
			<h1>Assunto do Documento</h1>
			<TextField
				className={classes.fields}
				onChange={onChangePulicWorkerName}
				type="public_worker_name"
				value={publicWorkerName}
				label="Nome do servidor"
				variant="filled"
			/>
			<TextField
				className={classes.fields}
				onChange={onChangeCpf}
				type="cpf"
				value={cpf}
				placeholder="CPF do servidor"
				variant="filled"
			/>
			<TextField
				className={classes.fields}
				onChange={onChangeOffice}
				type="office"
				value={office}
				placeholder="Cargo do servidor"
				variant="filled"
			/>
			<TextField
				className={classes.fields}
				onChange={onChangeClassWorker}
				type="class_worker"
				value={classWorker}
				placeholder="Classe do servidor"
				variant="filled"
			/>
			<TextField
				className={classes.fields}
				onChange={onChangeCapacity}
				type="capacity"
				value={capacity}
				placeholder="Lotaçao do servidor"
				variant="filled"
			/>
			<TextField
				className={classes.fields}
				onChange={onChangeCounty}
				type="county"
				value={county}
				placeholder="Município do servidor"
				variant="filled"
			/>

			<Button
				onClick={onClick}
				style={{ marginTop: "20px" }}
				variant="contained"
				color="primary"
			>
				Salvar
			</Button>
		</div>
	);
}
