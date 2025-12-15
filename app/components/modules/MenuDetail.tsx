'use client';

import useUserContext from "@/app/hooks/useUserContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { MenuDetail } from "@/app/types/menu";


interface Props {
    menu: any;
}

function MenuDetail({  menu }: Props) {
    const [menuDetails, setMenuDetails] = useState<MenuDetail[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUserContext();
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const detailApiRef = useRef<boolean>(false);
    const [totalNutrition, setTotalNutrition] = useState<{
        caloryQt: number;
        carboQt: number;
        protnQt: number;
        lipidQt: number;
        sgrsQt: number;
        natrmQt: number;
    }>({
        caloryQt: 0,
        carboQt: 0,
        protnQt: 0,
        lipidQt: 0,
        sgrsQt: 0,
        natrmQt: 0,
    });

    useEffect(() => {
        setTotalNutrition({
            caloryQt: menuDetails.reduce((acc, item) => acc + Number(item.caloryQt), 0),
            carboQt: menuDetails.reduce((acc, item) => acc + Number(item.carboQt), 0),
            protnQt: menuDetails.reduce((acc, item) => acc + Number(item.protnQt), 0),
            lipidQt: menuDetails.reduce((acc, item) => acc + Number(item.lipidQt), 0),
            sgrsQt: menuDetails.reduce((acc, item) => acc + Number(item.sgrsQt), 0),
            natrmQt: menuDetails.reduce((acc, item) => acc + Number(item.natrmQt), 0),
        });
    }, [menuDetails]);

    const fetchMenuDetail = useCallback(async (menu: any) => {

        if (!user.mblctfSessionidPrd || !menu.mealDvCd || detailApiRef.current) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/menu/detail`, {
                method: 'POST',
                body: JSON.stringify({ date:today, mealDvCd:menu.mealDvCd, conerDvCd:menu.conerDvCd, conerCRsvUseYn:menu.conerCRsvUseYn, conerCDelvUseYn:menu.conerCDelvUseYn, dlvrFloorRsvYn:menu.dlvrFloorRsvYn, mnuOfstockStbyStatFuncYn:menu.mnuOfstockStbyStatFuncYn, mblctfSessionidPrd:user.mblctfSessionidPrd, appInfo:user.appInfo, wmonid:user.wmonid }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setMenuDetails(data?.dataSets?.menuDetailList || []);
                detailApiRef.current = true;
            }
        } catch (error) {
            console.error('Failed to fetch menu detail:', error);
        } finally {
            setLoading(false);
        }
    }, [user.mblctfSessionidPrd, user.appInfo, user.wmonid, today]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
            fetchMenuDetail(menu);
    }, [menu]);

    return (
        <div className="w-full">
            <div>
                <p className="text-gray-800">{`탄수화물: ${totalNutrition.carboQt.toFixed(1)}g`}</p>
                <p className="text-gray-800">{`나트륨: ${totalNutrition.natrmQt.toFixed(1)} mg`}</p>
                <p className="text-gray-800">{`단백질: ${totalNutrition.protnQt.toFixed(1)}g`}</p>
                <p className="text-gray-800">{`지방: ${totalNutrition.lipidQt.toFixed(1)}g`}</p>
                <p className="text-gray-800">{`당류: ${totalNutrition.sgrsQt.toFixed(1)}g`}</p>
            </div>
        <div className="mt-2">
            <button
                onClick={handleToggle}
                className="flex items-center justify-between w-full text-left cursor-pointer transition-all duration-1s rounded transition-colors"
            >
                <h3 className="text-lg font-semibold text-gray-800">메뉴 정보</h3>
                <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            
            {isExpanded && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="text-sm mt-2 text-gray-500">영양 정보 로딩 중...</p>
                        </div>
                    )}
                    
                    {!loading && menuDetails.length > 0 && (
                        <div className="space-y-4">
                            {menuDetails.map((item: MenuDetail) => (
                                <div key={item.dispNm} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <h4 className="text-md font-semibold mb-3 text-gray-700">{item.dispNm}</h4>
                                    
                                    {/* 기본 영양 정보 */}
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">칼로리</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.caloryQt} kcal</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">탄수화물</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.carboQt}g</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">나트륨</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.natrmQt} mg</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">단백질</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.protnQt}g</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">지방</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.lipidQt}g</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded gap-2">
                                            <span className="text-sm font-medium text-gray-600">당류</span>
                                            <span className="text-sm font-semibold text-gray-800">{item.sgrsQt}g</span>
                                        </div>
                                    </div>

                                    {/* 알레르기 정보 */}
                                    {item.allerge && (
                                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                            <h5 className="text-sm font-semibold mb-1 text-yellow-800">알레르기 정보</h5>
                                            <p className="text-xs text-yellow-700">{item.allerge}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!loading && menuDetails.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            <p>영양 정보를 불러올 수 없습니다.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    )
}

export default MenuDetail;