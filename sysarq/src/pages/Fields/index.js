import CardContainer from "../components/Container/CardContainer";
import MenuCard from "../components/MenuCard";

import "./styles.css";

const Fields = () => (
	<CardContainer title="Campos" spacing={2}>
		<MenuCard
			icon="subject-icon"
			title="Assunto do Documento"
			url="/fields/document-subject"
			lg={4}
		/>
		<MenuCard icon="unit-icon" title="Unidade" url="/fields/unity" lg={4} />
		<MenuCard
			icon="abbreviation-icon"
			title="Caixa"
			url="/fields/box-abbreviation"
			lg={4}
		/>
		<MenuCard
			icon="document-type-icon"
			title="Tipo de Documento"
			url="/fields/document-type"
			lg={6}
		/>
		<MenuCard
			icon="shelf-rack-icon"
			title="Estante e Prateleira"
			url="/fields/shelf"
			lg={6}
		/>
	</CardContainer>
);

export default Fields;
