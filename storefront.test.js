// storefront.test.js - Unit tests with mocks and stubs
const { Cart, ProductService, NotificationService, OrderService } = require('./storefront');

// Test 1: Basic Cart Functionality (No mocks/stubs)
describe('Cart Basic Operations', () => {
  let cart;
  let productService;

  beforeEach(() => {
    cart = new Cart(1);
    productService = new ProductService();
    productService.addProduct(101, 'Laptop', 999.99, 10);
    productService.addProduct(102, 'Mouse', 29.99, 5);
  });

  test('should add product to cart when product is available', () => {
    // Act
    const result = cart.addProduct(101, 2, productService);
    
    // Assert
    expect(result).toBe(true);
    expect(cart.getItemCount()).toBe(1);
  });

  test('should throw error when adding unavailable product', () => {
    // Arrange
    productService.updateStock(101, 0);
    
    // Act & Assert
    expect(() => {
      cart.addProduct(101, 1, productService);
    }).toThrow('Product 101 is not available');
  });

  test('should calculate correct total for multiple items', () => {
    // Arrange
    cart.addProduct(101, 1, productService);
    cart.addProduct(102, 2, productService);
    
    // Act
    const total = cart.calculateTotal(productService);
    
    // Assert
    expect(total).toBeCloseTo(999.99 + (29.99 * 2));
  });
});

// Test 2: Using a Mock for Notification Service
describe('Order Service with Mock Notification', () => {
  test('should send both email and SMS when creating order', () => {
    // Arrange
    const mockNotificationService = {
      sendEmail: jest.fn().mockReturnValue(true),
      sendSMS: jest.fn().mockReturnValue(true)
    };

    const orderService = new OrderService(mockNotificationService);
    const cart = new Cart(1);
    const productService = new ProductService();
    
    productService.addProduct(101, 'Tablet', 299.99, 5);
    cart.addProduct(101, 1, productService);

    // Act
    const order = orderService.createOrder(cart, 'customer@example.com', '+1234567890');

    // Assert
    expect(order.orderId).toBeDefined();
    expect(order.status).toBe('confirmed');
    
    // Verify mock interactions
    expect(mockNotificationService.sendEmail).toHaveBeenCalledWith(
      'customer@example.com',
      'Order Confirmation',
      expect.stringContaining(`Your order #${order.orderId} has been created successfully.`)
    );
    
    expect(mockNotificationService.sendSMS).toHaveBeenCalledWith(
      expect.stringContaining(`Your order #${order.orderId} has been confirmed`)
    );
    
    expect(mockNotificationService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.sendSMS).toHaveBeenCalledTimes(1);
  });
});

// Test 3: Using a Stub for Product Availability
describe('Cart with Stubbed Product Service', () => {
  test('should handle out-of-stock products using stub', () => {
    // Arrange
    const cart = new Cart(1);
    
    // Create a stub product service that always returns false for availability
    const stubProductService = {
      isProductAvailable: jest.fn().mockReturnValue(false),
      getProductPrice: jest.fn().mockReturnValue(99.99)
    };

    // Act & Assert
    expect(() => {
      cart.addProduct(999, 1, stubProductService);
    }).toThrow('Product 999 is not available');
    
    // Verify the stub was called
    expect(stubProductService.isProductAvailable).toHaveBeenCalledWith(999);
    expect(stubProductService.isProductAvailable).toHaveBeenCalledTimes(1);
  });

  test('should calculate total using stubbed product prices', () => {
    // Arrange
    const cart = new Cart(1);
    
    const stubProductService = {
      isProductAvailable: jest.fn().mockReturnValue(true),
      getProductPrice: jest.fn()
        .mockReturnValueOnce(50.00)  // First call for product 201
        .mockReturnValueOnce(25.00)  // Second call for product 202
    };

    // Act
    cart.addProduct(201, 2, stubProductService); // 2 items @ $50 = $100
    cart.addProduct(202, 1, stubProductService); // 1 item @ $25 = $25
    const total = cart.calculateTotal(stubProductService);

    // Assert
    expect(total).toBe(125.00);
    expect(stubProductService.getProductPrice).toHaveBeenCalledWith(201);
    expect(stubProductService.getProductPrice).toHaveBeenCalledWith(202);
    expect(stubProductService.getProductPrice).toHaveBeenCalledTimes(2);
  });
});

// Test 4: Edge Case - Empty Cart Order Creation
describe('Order Service Edge Cases', () => {
  test('should throw error when creating order with empty cart', () => {
    // Arrange
    const mockNotificationService = {
      sendEmail: jest.fn(),
      sendSMS: jest.fn()
    };

    const orderService = new OrderService(mockNotificationService);
    const emptyCart = new Cart(1);

    // Act & Assert
    expect(() => {
      orderService.createOrder(emptyCart, 'test@example.com', '+1234567890');
    }).toThrow('Cannot create order with empty cart');

    // Verify no notifications were sent
    expect(mockNotificationService.sendEmail).not.toHaveBeenCalled();
    expect(mockNotificationService.sendSMS).not.toHaveBeenCalled();
  });
});