import React from "react";
import MainConatiner from "partials/Container";
import HomePageBuilder from "./pages/home";
import AboutPageBuilder from "./pages/about-page";
import OurTeamBuilder from "./pages/our-team";
import ServicePageBulder from "./pages/services";

export type PageKind = "main" | "service";

type MenuPageProps = {
    menuId: number;
    pageKind?: PageKind;
};

type MenuPageComponent = React.ComponentType<MenuPageProps>;
type MenuPageRegistry = Record<string, MenuPageComponent>;
type PageKindRegistry = Partial<Record<PageKind, MenuPageComponent>>;

const buildRegistryKey = (menuId: number, pageKind: PageKind): string => `${pageKind}:${menuId}`;

const NotConfiguredPage: MenuPageComponent = ({ menuId, pageKind = "main" }) => {
    const registryKeys = Object.keys(menuPageRegistry);

    return (
        <MainConatiner title={`${pageKind === "service" ? "სერვისი" : "გვერდი"} #${menuId}`}>
            <div style={{ background: "#fff", borderRadius: 6, padding: 20 }}>
                ამ მენიუსთვის კომპონენტი ჯერ არ არის მიბმული.
                <br />
                დაამატე mapping ფაილში: `containers/logged/dynamic-pages/page-registry.tsx`
                <br />
                <br />
                მიმდინარე key: <b>{buildRegistryKey(menuId, pageKind)}</b>
                <br />
                ხელმისაწვდომი keys: <b>{registryKeys.length ? registryKeys.join(", ") : "-"}</b>
            </div>
        </MainConatiner>
    );
};

// ერთიანი registry - კონფლიქტი აღარ იქნება:
// "main:2" და "service:2" სხვადასხვა key-ებია.
export const menuPageRegistry: MenuPageRegistry = {
    "main:2": HomePageBuilder,
    "main:3": AboutPageBuilder,
    "main:5": OurTeamBuilder,
};

const pageKindRegistry: PageKindRegistry = {
    service: ServicePageBulder,
};

export const resolveMenuPageComponent = (
    menuId: number,
    pageKind: PageKind = "main"
): MenuPageComponent => {
    const key = buildRegistryKey(menuId, pageKind);
    return menuPageRegistry[key] || pageKindRegistry[pageKind] || NotConfiguredPage;
};
