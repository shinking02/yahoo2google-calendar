import Layout from "./components/Layout";
import LoginBox from "./components/LoginBox";
import ImportBox from "./components/ImportBox";

export default function App() {
    return (
        <Layout>
            <LoginBox />
            <ImportBox />
        </Layout>
    );
}