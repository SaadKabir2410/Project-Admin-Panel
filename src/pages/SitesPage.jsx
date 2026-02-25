import ResourcePage from "../component/common/ResourcePage";
import { DB } from "../data/DB"
import SiteModal from "../component/common/SiteModal"
import DeleteConfirmModal from '../component/common/DeleteConfirmation'

export default function SitesPage() {
    const columns = [
        { key: 'name', label: 'NAME', bold: true },
        { key: 'ocn', label: 'OCN', render: (val) => <span className="uppercase font-mono text-blue-500">{val}</span> },
        { key: 'countryName', label: 'COUNTRY' },
        { key: 'address', label: 'ADDRESS' },
    ]

    return (
        <ResourcePage
            title="Sites"
            apiObject={DB.sites}
            columns={columns}
            ModalComponent={SiteModal}
            DeleteModal={DeleteConfirmModal}
            searchPlaceholder="Search by Site name, OCN, or Location..."
            createButtonText="New Site"
            breadcrumb={['Home', 'Sites']}
        />
    )
}