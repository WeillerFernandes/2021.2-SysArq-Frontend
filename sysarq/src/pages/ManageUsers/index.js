import { useEffect, useState } from "react";
import {
	Button,
	Select,
	MenuItem,
	TextField,
	makeStyles,
	Container,
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@material-ui/core";
import InputMask from "react-input-mask";
import { validateBr } from "js-brasil";
import PropTypes from "prop-types";
import { axiosProfile } from "../../Api";
import PopUpAlert from "../components/PopUpAlert";

const useStyles = makeStyles((theme) => ({
	title: {
		paddingTop: theme.spacing(4),
		color: "#5289B5",
		fontSize: "30px",
		fontWeight: "bold",
		fontFamily: ['"Montserrat"', "sans-serif"],
	},
	container: {
		marginTop: theme.spacing(6),
		alignContents: "center",
		textAlign: "center",
		marginBottom: theme.spacing(6),
	},
	input: {
		textAlign: "center",
		minWidth: "300px",
		width: "50%",
	},
	paper: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
	button: {
		marginTop: "25px",
		marginBottom: "25px",
		padding: "1rem",
		border: "0",
		outline: "0",
		color: "#F6F6F6",
		fontWeight: "500",
		background: "#5289B5",
		fontSize: "1rem",
		letterSpacing: "1.25px",
		borderRadius: "4px",
		transition: "filter 0.4s",
		height: "50px",

		"&:hover": {
			filter: "brightness(0.9)",
		},
	},
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
}));

const UserRow = ({ user, onSuccess, onError }) => {
	const classes = useStyles();
	const [state, setState] = useState({
		username: user.username,
		firstName: user.first_name,
		lastName: user.last_name,
		userType: user.user_type,
		cpf: user.cpf,
	});

	const [invalid, setInvalid] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const checkInvalid = () => {
		/* eslint-disable-next-line no-restricted-syntax */
		for (const val of Object.values(state)) {
			if (val === "" || val === null || val === undefined) {
				return true;
			}
		}

		if (!validateBr.cpf(state.cpf)) {
			return true;
		}

		if (state.username.length < 3) {
			return true;
		}

		return false;
	};

	useEffect(() => {
		setInvalid(checkInvalid());
	}, [state]);

	const onSave = () => {
		axiosProfile
			.post("api/token/refresh/", {
				refresh: localStorage.getItem("tkr"),
			})
			.then((res) => {
				localStorage.setItem("tk", res.data.access);
				localStorage.setItem("tkr", res.data.refresh);

				axiosProfile
					.put(
						`users/${user.id}/`,
						{
							user_type: state.userType,
							username: state.username,
							first_name: state.firstName,
							last_name: state.lastName,
							cpf: state.cpf,
						},
						{
							headers: {
								Authorization: `JWT ${localStorage.getItem("tk")}`,
							},
						}
					)
					.then(() => {
						onSuccess();
					})
					.catch(() => {
						onError();
					});
			});
	};

	const onDelete = () => {
		if (user.id === 1) {
			onError();
			return;
		}

		axiosProfile
			.post("api/token/refresh/", {
				refresh: localStorage.getItem("tkr"),
			})
			.then((res) => {
				localStorage.setItem("tk", res.data.access);
				localStorage.setItem("tkr", res.data.refresh);

				axiosProfile
					.delete(`users/${user.id}/`, {
						headers: {
							Authorization: `JWT ${localStorage.getItem("tk")}`,
						},
					})
					.then(() => {
						onSuccess();
					})
					.catch(() => {
						onError();
					});
			});
	};

	return (
		<>
			<TableRow className={classes.root}>
				<TableCell>
					<Button
						size="small"
						style={{ marginBottom: "5px" }}
						disabled={user.id === 1}
						onClick={() => onDelete()}
					>
						Excluir
					</Button>
					<Button
						size="small"
						color="secondary"
						disabled={invalid}
						onClick={() => onSave()}
					>
						Salvar
					</Button>
				</TableCell>
				<TableCell component="th" scope="root">
					<TextField
						value={state.username}
						name="username"
						onChange={handleChange}
					/>
				</TableCell>
				<TableCell>
					<TextField
						value={state.firstName}
						name="firstName"
						onChange={handleChange}
					/>
				</TableCell>
				<TableCell>
					<TextField
						value={state.lastName}
						name="lastName"
						onChange={handleChange}
					/>
				</TableCell>
				<TableCell>
					<InputMask
						mask="999.999.999-99"
						value={state.cpf}
						alwaysShowMask
						onChange={handleChange}
					>
						<TextField name="cpf" />
					</InputMask>
				</TableCell>
				<TableCell>
					<Select
						defaultValue={state.userType}
						name="userType"
						onChange={handleChange}
					>
						<MenuItem value="AD">Administrador</MenuItem>
						<MenuItem value="AL">Alimentador</MenuItem>
						<MenuItem value="VI">Visualizador</MenuItem>
					</Select>
				</TableCell>
			</TableRow>
		</>
	);
};

UserRow.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string.isRequired,
		first_name: PropTypes.string.isRequired,
		last_name: PropTypes.string.isRequired,
		user_type: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		cpf: PropTypes.string.isRequired,
	}).isRequired,
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
};

const UserTable = ({ users, onSuccess, onError }) => {
	const [state, setState] = useState({
		usernameFilter: "",
		firstNameFilter: "",
		lastNameFilter: "",
		cpfFilter: "",
		userTypeFilter: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => setFilteredUsers([...users]), [users]);

	useEffect(() => {
		setFilteredUsers(
			users.filter(
				(u) =>
					u.username
						.toLowerCase()
						.includes(state.usernameFilter.toLowerCase()) &&
					u.first_name
						.toLowerCase()
						.includes(state.firstNameFilter.toLowerCase()) &&
					u.last_name
						.toLowerCase()
						.includes(state.lastNameFilter.toLowerCase()) &&
					u.cpf
						.replace(/\D/g, "")
						.includes(state.cpfFilter.replace(/\D/g, "")) &&
					u.user_type.toLowerCase().includes(state.userTypeFilter.toLowerCase())
			)
		);
	}, [state]);

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell align="center">
							<div>
								<span>Nome de usuário</span>
								<TextField
									value={state.usernameFilter}
									name="usernameFilter"
									onChange={handleChange}
								/>
							</div>
						</TableCell>
						<TableCell align="center">
							<div style={{ display: "inline-block" }}>
								<span>Nome</span>
								<TextField
									value={state.firstNameFilter}
									name="firstNameFilter"
									onChange={handleChange}
								/>
							</div>
						</TableCell>
						<TableCell align="center">
							<div>
								<span>Sobrenome</span>
								<TextField
									value={state.lastNameFilter}
									name="lastNameFilter"
									onChange={handleChange}
								/>
							</div>
						</TableCell>
						<TableCell align="center">
							<div>
								<span>CPF</span>
								<TextField
									value={state.cpfFilter}
									name="cpfFilter"
									onChange={handleChange}
								/>
							</div>
						</TableCell>
						<TableCell align="center">
							<div>
								<span>Tipo de usuário</span>
								<Select
									defaultValue={state.userTypeFilter}
									displayEmpty
									name="userTypeFilter"
									onChange={handleChange}
								>
									<MenuItem value="">Todos</MenuItem>
									<MenuItem value="AD">Administrador</MenuItem>
									<MenuItem value="AL">Alimentador</MenuItem>
									<MenuItem value="VI">Visualizador</MenuItem>
								</Select>
							</div>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredUsers.map((u) => (
						<UserRow
							key={u.username}
							user={u}
							onSuccess={onSuccess}
							onError={onError}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

UserTable.propTypes = {
	users: PropTypes.arrayOf(
		PropTypes.shape({
			username: PropTypes.string.isRequired,
			first_name: PropTypes.string.isRequired,
			last_name: PropTypes.string.isRequired,
			user_type: PropTypes.string.isRequired,
			id: PropTypes.number.isRequired,
		})
	).isRequired,
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
};

const ManageUsers = () => {
	const [users, setUsers] = useState([]);

	const [openAlert, setOpenAlert] = useState(false);
	const [alertHelperText, setAlertHelperText] = useState("");
	const [severityAlert, setSeverityAlert] = useState("error");

	const classes = useStyles();

	const onSuccess = () => {
		setOpenAlert(true);
		setSeverityAlert("success");
		setAlertHelperText("Modificações salvas");
	};

	const onError = () => {
		setOpenAlert(false);
		setSeverityAlert("error");
		setAlertHelperText("Ocorreu um erro. Tente novamente mais tarde.");
	};

	const handleAlertClose = () => setOpenAlert(false);

	useEffect(() => {
		axiosProfile
			.post("api/token/refresh/", {
				refresh: localStorage.getItem("tkr"),
			})
			.then((res) => {
				localStorage.setItem("tk", res.data.access);
				localStorage.setItem("tkr", res.data.refresh);

				axiosProfile
					.get("users/get-users/", {
						headers: {
							Authorization: `JWT ${localStorage.getItem("tk")}`,
						},
					})
					.then((usersRes) => {
						setUsers(usersRes.data);
					});
			});
	}, []);

	return (
		<Container maxWidth="lg" className={classes.container}>
			<UserTable users={users} onSuccess={onSuccess} onError={onError} />

			<PopUpAlert
				open={openAlert}
				handleClose={handleAlertClose}
				severity={severityAlert}
				helperText={alertHelperText}
			/>
		</Container>
	);
};

export default ManageUsers;
