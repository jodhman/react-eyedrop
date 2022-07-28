/* eslint-disable quotes */
import * as Util from "../src/magnifierUtils/MagnifierUtil";

const drawImageMock = jest.fn();
const getImageDataMock = jest.fn();
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  drawImage: drawImageMock,
  getImageData: getImageDataMock,
});

describe("getColorFromMousePosition()", () => {
  let mockEvent, mockMagnifier, mockTargetRect, rgbToHexSpy;

  beforeAll(() => {
    mockEvent = {
      clientX: 50,
      clientY: 50,
    };

    mockMagnifier = {
      ownerDocument: {
        defaultView: {
          scrollX: 100,
          scrollY: 100,
        },
      },
      querySelector: () => document.createElement("canvas"),
    };

    mockTargetRect = {
      left: 75,
      lop: 75,
    };

    rgbToHexSpy = jest.spyOn(Util, "rgbToHex");
    rgbToHexSpy.mockReturnValue("#5541dc");
    getImageDataMock.mockReturnValue({
      data: [100, 125, 0],
    });
  });

  afterAll(() => {
    rgbToHexSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("returns hex color code from the mouse pointer location", () => {
    expect(
      Util.getColorFromMousePosition(
        mockEvent,
        mockMagnifier,
        mockTargetRect,
        5
      )
    ).toEqual("#5541dc");
  });

  it("returns nothing if canvas context is not defined", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValueOnce(null);
    expect(
      Util.getColorFromMousePosition(
        mockEvent,
        mockMagnifier,
        mockTargetRect,
        5
      )
    ).toEqual(null);
  });
});

describe("getSyncedPosition()", () => {
  it("returns synced position of the magnifier with respect to the window offset coordinates", () => {
    const mockMagnifier = {
      offsetLeft: 10,
      offsetTop: 10,
      ownerDocument: {
        defaultView: {
          pageXOffset: 50,
          pageYOffset: 30,
        },
      },
    };

    const mockTargetRect = { top: 5, left: 5 };

    expect(
      Util.getSyncedPosition(mockMagnifier, mockTargetRect, 150, 5)
    ).toEqual({ left: -562.5, top: -462.5 });
  });
});

describe("isDescendant()", () => {
  let parentMock, childMock, grandChildMock;

  beforeEach(() => {
    parentMock = document.createElement("div");
    childMock = document.createElement("div");
    grandChildMock = document.createElement("div");

    childMock.appendChild(grandChildMock);
    parentMock.appendChild(childMock);
  });

  it("returns true if arguments have parent-child relation", () => {
    expect(Util.isDescendant(parentMock, grandChildMock)).toBe(true);
  });

  it("returns false if arguments do not have parent-child relation", () => {
    expect(Util.isDescendant(childMock, parentMock)).toBe(false);
  });
});

describe("isMouseMovingOut()", () => {
  let mockEvent, mockTargetRect;

  beforeEach(() => {
    mockEvent = {
      clientX: 100,
      clientY: 100,
    };

    mockTargetRect = {
      left: 150,
      top: 150,
      width: 200,
      height: 300,
    };
  });

  it("returns true if mouse coordinates are outside rect boundaries", () => {
    expect(Util.isMouseMovingOut(mockEvent, mockTargetRect)).toBe(true);
  });

  it("returns false if mouse coordinates are inside rect boundaries", () => {
    mockEvent = {
      clientX: 160,
      clientY: 160,
    };

    expect(Util.isMouseMovingOut(mockEvent, mockTargetRect)).toBe(false);
  });
});

describe("pixelateCanvas()", () => {
  it("minimizes canvas image and stretches it", () => {
    const mockImage = new Image();
    mockImage.src =
      "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    mockImage.width = 100;
    mockImage.height = 100;

    const mockCanvas = document.createElement("canvas");
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: drawImageMock,
      getImageData: getImageDataMock,
    });

    Util.pixelateCanvas(mockImage, mockCanvas, 5);

    expect(drawImageMock).toHaveBeenCalledWith(mockImage, 0, 0, 20, 20);
    expect(drawImageMock).toHaveBeenCalledWith(
      mockCanvas,
      0,
      0,
      20,
      20,
      0,
      0,
      100,
      100
    );
  });
});

describe("rgbToHex()", () => {
  it("returns hex color code from rgb color", () => {
    expect(Util.rgbToHex(145, 241, 125)).toEqual("#91f17d");
    expect(Util.rgbToHex(255, 255, 255)).toEqual("#ffffff");
    expect(Util.rgbToHex(0, 0, 0)).toEqual("#000000");
  });
});

describe("setUpMagnifier()", () => {
  let mockMagnifier, mockMagnifierContent, originalBodyColor;

  beforeAll(() => {
    mockMagnifier = document.createElement("div");
    mockMagnifierContent = document.createElement("div");
    mockMagnifierContent.innerHTML = "some mock html";

    mockMagnifier.appendChild(mockMagnifierContent);
    document.body.appendChild(mockMagnifier);
    originalBodyColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "rgb(85, 85, 85)";
  });

  afterAll(() => {
    document.body.removeChild(mockMagnifier);
    document.body.style.backgroundColor = originalBodyColor;
  });

  it("resets magnifier content inner HTML", () => {
    Util.setUpMagnifier(mockMagnifier, mockMagnifierContent);
    expect(mockMagnifierContent.innerHTML).toEqual("");
  });

  it("applies body background color to magnifier background", () => {
    Util.setUpMagnifier(mockMagnifier, mockMagnifierContent);
    expect(mockMagnifier.style.backgroundColor).toEqual("rgb(85, 85, 85)");
  });
});
