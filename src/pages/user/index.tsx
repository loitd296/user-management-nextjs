import Layout from '../components/layout';
import UserTable from './components/UserTable';

const UserPage: React.FC = () => {
  
  return (
    <Layout>
      <div className="p-8">
        <UserTable />
      </div>
    </Layout>
  );
};

export default UserPage;
