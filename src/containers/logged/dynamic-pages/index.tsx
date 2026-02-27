import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import MainConatiner from "partials/Container";
import { resolveMenuPageComponent } from "./page-registry";

const DynamicMenuPage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const menuId = useMemo(() => Number(id), [id]);
    const pageKind = location.pathname.startsWith("/pages/services/") ? "service" : "main";

    if (!Number.isFinite(menuId)) {
        return (
            <MainConatiner title="გვერდი ვერ მოიძებნა">
                <div style={{ background: "#fff", borderRadius: 6, padding: 20 }}>
                    არასწორი გვერდის ID.
                </div>
            </MainConatiner>
        );
    }

    const PageComponent = resolveMenuPageComponent(menuId, pageKind);
    return <PageComponent menuId={menuId} pageKind={pageKind} />;
};

export default DynamicMenuPage;
