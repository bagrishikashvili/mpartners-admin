import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import useQuery from "hooks/useQueryCustom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CircularProgress } from '@mui/material';

const NavigationMenu = () => {
    const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({});

    const { data: item = [], isLoading } = useQuery<any>(["get_web_menus"], {
        endpoint: `/menus`,
        options: { method: "get" },
    }, { enabled: true });

    const toggleSubMenu = (menuId: number) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };

    return (
        <Container>
            <NavigationMenuBlock>
                <NavigationMenuLi>
                    <NavLink to="/dashboard">მთავარი</NavLink>
                </NavigationMenuLi>
                <NavigationMenuLi>
                    <NavLink to="/menu-control">მენიუს კონტროლი</NavLink>
                </NavigationMenuLi>
                <NavigationMenuLi>
                    <NavLink to="/contact-settings">საკონტაქტო მონაცემები</NavLink>
                </NavigationMenuLi>
                <NavigationMenuLi>
                    <NavLink to="/recomendation">რეკომენდაციები</NavLink>
                </NavigationMenuLi>
                <NavigationMenuLi>
                    <NavLink to="/news">სიახლეები</NavLink>
                </NavigationMenuLi>
                {!isLoading ? <>
                <NavigationMenuLi>
                    <NavIsland>გვერდები</NavIsland>
                </NavigationMenuLi>
                {(item?.data ?? []).filter((x: any) => x.id_name !== 'contact_us' && x.id_name !== 'news_and_analytics').map((menu: any) => {
                    const menuId = menu?.id_name;
                    const isExpandable = menuId === 'services';
                    const isExpanded = Boolean(expandedMenus[menuId]);
                    const subMenus = Array.isArray(menu?.sub_menus) ? menu.sub_menus : [];

                    return (
                        <NavigationMenuGroup key={menu.id}>
                            <NavigationMenuLi>
                                {isExpandable ? (
                                    <SubMenuToggle
                                        type="button"
                                        onClick={() => toggleSubMenu(menuId)}
                                        aria-expanded={isExpanded}
                                    >
                                        <span>{menu.name}</span>
                                        <Arrow $expanded={isExpanded}><KeyboardArrowDownIcon /></Arrow>
                                    </SubMenuToggle>
                                ) : (
                                    <NavLink to={`/pages/${menu.id}`}>{menu.name}</NavLink>
                                )}
                            </NavigationMenuLi>

                            {isExpandable && isExpanded && (
                                <SubMenuList>
                                    {subMenus.map((subMenu: any) => (
                                        <SubMenuItem key={subMenu.id}>
                                            <NavLink to={`/pages/services/${subMenu.id}`}>{subMenu.name}</NavLink>
                                        </SubMenuItem>
                                    ))}
                                </SubMenuList>
                            )}
                        </NavigationMenuGroup>
                    );
                })}
                </> : <NavigationMenuLi><div id="Loading" style={{marginTop: 20, marginLeft: 90}}><CircularProgress/></div></NavigationMenuLi>}
            </NavigationMenuBlock>
        </Container>
    )
}

const Container = styled('div')`
    background-color: rgb(40 40 40);
    height: 100%;
    width: 250px;
    position: fixed;
`
const NavigationMenuBlock = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-top: 16px;
    max-height: calc(100vh - 16px);
    overflow-y: auto;
    overflow-x: hidden;
    .active {
        background-color: rgb(26 26 26);
        border-left: 3px solid rgb(243, 116, 45);
    }
`
const NavigationMenuGroup = styled.li`
    list-style: none;
`
const NavigationMenuLi = styled.ul`
    display: flex;
    flex-direction: row;
    padding: 0px 0px;
    & > a {
        padding: 10px 8px;
        flex: 1;
        display: block;
        background-color: rgb(40 40 40);
        border-radius: 0px;
        color: rgb(202 204 221);
        font-family: 'Plus Jakarta Sans', 'BPG Arial Caps', Helvetica, sans-serif;
        font-size: 13px;
        &:hover {
            background-color: rgb(26 26 26);
        }
    }
`
const SubMenuToggle = styled.button`
    padding: 10px 8px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: rgb(40 40 40);
    border-radius: 0px;
    border: none;
    color: rgb(202 204 221);
    font-family: 'Plus Jakarta Sans', 'BPG Arial Caps', Helvetica, sans-serif;
    font-size: 13px;
    cursor: pointer;
    &:hover {
        background-color: rgb(26 26 26);
    }
`
const Arrow = styled.span<{ $expanded: boolean }>`
    display: inline-block;
    transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`
const SubMenuList = styled.ul`
    list-style: none;
    padding-left: 0px;
    margin: 0;
`
const SubMenuItem = styled.li`
    display: flex;
    & > a {
        padding: 8px 8px 8px 24px;
        flex: 1;
        display: block;
        background-color: rgb(40 40 40);
        border-radius: 0px;
        color: rgb(202 204 221);
        font-family: 'Plus Jakarta Sans', 'BPG Arial Caps', Helvetica, sans-serif;
        font-size: 12px;
        &:hover {
            background-color: rgb(26 26 26);
        }
    }
`
const NavIsland = styled.div`
    padding: 10px 8px;
    flex: 1;
    display: block;
    background-color: rgb(57 56 56);
    border-radius: 0px;
    color: rgb(202 204 221);
    font-family: 'Plus Jakarta Sans', 'BPG Arial Caps', Helvetica, sans-serif;
    font-size: 13px;
    border-top: 1px solid #424242;
    border-bottom: 1px solid #424242;
`

export default NavigationMenu;
