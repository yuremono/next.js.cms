"use client";

export function CustomValueTest() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">カスタム値テスト</h2>
      
      {/* 透明度テスト */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">透明度テスト</h3>
        <div className="flex space-x-4">
          <div className="z-10 text-[20vmin] top-50 w-20 h-20 w-2/5 w-1/3 bg-blue-500 opacity-[.67] flex items-center justify-center text-white font-thin">
            .67
          </div>
          <div className="w-20 h-20 bg-red-500 opacity-[0.1] flex items-center justify-center text-white">
            .5
          </div>
          <div className="w-20 h-20 bg-green-500 opacity-[0.25] flex items-center justify-center text-white">
            .25
          </div>
        </div>
      </div>

      {/* 幅テスト */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">幅テスト</h3>
        <div className="space-y-2">
          <div className="w-[200px] h-8 bg-yellow-400 flex items-center justify-center">
            w-[200px]
          </div>
          <div className="w-[300px] h-8 bg-purple-400 flex items-center justify-center">
            w-[300px]
          </div>
        </div>
      </div>

      {/* 背景色テスト */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">背景色テスト</h3>
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-[#ff0000] flex items-center justify-center text-white">
            #ff0000
          </div>
          <div className="w-20 h-20 bg-[#00ff00] flex items-center justify-center text-white">
            #00ff00
          </div>
          <div className="w-20 h-20 bg-[#0000ff] flex items-center justify-center text-white">
            #0000ff
          </div>
        </div>
      </div>

      {/* 高さ計算テスト */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">高さ計算テスト</h3>
        <div className="h-[calc(100vh-2rem)] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
          h-[calc(100vh-2rem)]
        </div>
      </div>

      {/* フォントサイズテスト */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">フォントサイズテスト</h3>
        <div className="space-y-2">
          <p className="text-[12px]">text-[12px] - 12px</p>
          <p className="text-[16px]">text-[16px] - 16px</p>
          <p className="text-[24px]">text-[24px] - 24px</p>
        </div>
      </div>
    </div>
  );
} 