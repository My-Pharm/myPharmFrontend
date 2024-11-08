import { useState } from "react";
import { Search, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function MobileLayout() {
  const [searchResults, setSearchResults] = useState([]);
  const [dbData, setDbData] = useState(["Item 1", "Item 2", "Item 3"]); // 더미 데이터

  const handleSearch = (e) => {
    e.preventDefault();
    // 실제 검색 로직을 여기에 구현하세요
    setSearchResults(["Result 1", "Result 2"]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gray-100">
      {/* 상단 앱 바 */}
      <div className="bg-white shadow-md p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">뒤로 가기</span>
        </Button>
        <h1 className="text-lg font-semibold flex-grow text-center mr-8">
          이 약 복용해도되나요?
        </h1>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-grow overflow-auto p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="검색..."
              className="w-full pl-10 pr-4"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">검색 결과</h2>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} className="mb-2">
                  {result}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">DB 데이터</h2>
          <ul>
            {dbData.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-2 mt-4 mb-4">
          <Checkbox id="pregnant" />
          <label
            htmlFor="pregnant"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            임산부입니다
          </label>
        </div>
      </div>

      {/* 하단 버튼 및 체크박스 */}
      <div className="p-4 bg-white shadow-md mt-auto">
        <Button className="w-full mb-4">검사하기</Button>
        <div className="flex items-center space-x-2">
          <Checkbox id="agree-terms" />
          <label
            htmlFor="agree-terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            약관에 동의합니다
          </label>
        </div>
      </div>
    </div>
  );
}
