'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import useUserContext from "../hooks/useUserContext";
import MenuDetail from "../components/modules/MenuDetail";

interface MenuItem {
    mealNm: string;
    dispNm: string;
    imgPath: string;
    totCaloryQt: number;
  }
  
  interface MenuData {
    dataSets?: {
      menuList?: MenuItem[];
    };
  }

export default function Menu() {
    const [menuData, setMenuData] = useState<MenuData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext();
  
    const lunchMenus = menuData?.dataSets?.menuList?.filter((v: MenuItem)=> v?.mealNm === "중식")?.filter((v: MenuItem, i: number)=> i<4)
console.log('lunchMenus', lunchMenus);

    useEffect(() => {
        if (!user.wmonid || !user.mblctfSessionidPrd) {
          return;
        }
      
        // API 호출 함수
        const fetchMenuData = async () => {
          setLoading(true);
          setError(null);
          
    
          try {
            console.log('fetchMenuData', user);
            
            const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const response = await fetch(`/api/menu`, {
              method: 'POST',
              body: JSON.stringify({ mblctfSessionidPrd: user.mblctfSessionidPrd, date: date }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            setMenuData(data);
            setLoading(false);
            
          } catch (error) {
            setLoading(false);
            setError('메뉴 데이터 로드 실패: ' + (error instanceof Error ? error.message : String(error)));
            console.error('API 호출 오류:', error);
          }
        };
    
        // 컴포넌트 마운트 시 API 호출
        fetchMenuData();
      }, [user])

    return <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
    <main className="flex flex-col row-start-2 items-center sm:items-start">
      {/* 메뉴 데이터 표시 영역 */}
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">H카페테리아 메뉴</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">메뉴를 불러오는 중...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>오류:</strong> {error}
          </div>
        )}
        
        {menuData && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">오늘의 메뉴</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {
                lunchMenus?.map((v: MenuItem)=> (
                  <div key={v?.dispNm} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">{v?.dispNm}</h3>
                      <Image 
                        src={`${v?.imgPath ? `https://hcafe.hgreenfood.com${v.imgPath}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png'}`} 
                        alt={v?.dispNm} 
                        width={200} 
                        height={200}
                        className="rounded-lg object-cover mb-3"
                      />
                      <p className="text-lg font-medium mb-4">{`${v?.totCaloryQt} kcal`}</p>
                      <MenuDetail menu={v} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

    </main>
  </div>
}